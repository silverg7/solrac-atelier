"""SOL-BUG-03: private routes, photo transactions and asynchronous intake regressions."""
import base64
import hashlib
import http.client
import json
import subprocess
import tempfile
import threading
import time
import unittest
from concurrent.futures import ThreadPoolExecutor
from functools import partial
from pathlib import Path
from unittest.mock import patch

from scripts import server

ROOT = Path(__file__).resolve().parents[1]


class AuditRegressionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='solrac_audit_')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'data').mkdir()
        (self.root / 'data/private.txt').write_text('private fixture')
        (self.root / 'index.html').write_text('public fixture')
        (self.root / '.git').mkdir()
        (self.root / '.git/config').write_text('private fixture')
        (self.root / 'assets').mkdir()
        (self.root / 'assets/leak').symlink_to(self.root / 'data/private.txt')
        self.log = self.root / 'data/inquiries.jsonl'

        class Handler(server.InquiryRequestHandler):
            inquiries_file = self.log

            def log_message(self, *args):
                pass

        self.httpd = server.ThreadedInquiryServer(('127.0.0.1', 0), partial(Handler, directory=self.temp.name))
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()
        self.addCleanup(self.httpd.server_close)
        self.addCleanup(self.httpd.shutdown)

    def request(self, method, path, payload=None):
        conn = http.client.HTTPConnection(*self.httpd.server_address, timeout=10)
        body = json.dumps(payload) if payload is not None else None
        conn.request(method, path, body, {'Content-Type': 'application/json'})
        resp = conn.getresponse()
        result = resp.status, resp.read()
        conn.close()
        return result

    def test_private_files_blocked_after_decoding_and_for_head(self):
        for path in ['/data/private.txt', '/%64ata/private.txt', '/data%2fprivate.txt',
                     '/assets/../data/private.txt', '/assets/leak', '/.git/config', '/assets/']:
            for method in ['GET', 'HEAD']:
                with self.subTest(path=path, method=method):
                    status, body = self.request(method, path)
                    self.assertEqual(status, 403)
                    self.assertNotIn(b'private fixture', body)
        self.assertEqual(self.request('GET', '/')[0], 200)
        self.assertEqual(self.request('HEAD', '/index.html')[0], 200)

    def test_same_preferred_reference_never_overwrites_concurrent_photos(self):
        original = server.generate_unique_ref

        def widen_race(*args, **kwargs):
            result = original(*args, **kwargs)
            time.sleep(0.04)
            return result

        def post(index):
            photo = b'\xff\xd8\xff\xe0' + bytes([65 + index]) * 40 + b'\xff\xd9'
            payload = dict(client_name=f'Audit fixture {index}', client_email='audit@example.invalid',
                           location='Porto', form_loaded_at=time.time()*1000 - 5000,
                           dossier_ref='SOL-2026-AAAA', photos=[dict(mime_type='image/jpeg',
                           data=base64.b64encode(photo).decode())])
            return self.request('POST', '/api/inquiry', payload)

        with patch.object(server, 'generate_unique_ref', widen_race):
            with ThreadPoolExecutor(max_workers=4) as pool:
                results = list(pool.map(post, range(4)))
        self.assertTrue(all(status == 201 for status, _ in results), results)
        records = [json.loads(line) for line in self.log.read_text().splitlines()]
        self.assertEqual(len(records), 4)
        self.assertEqual(len({r['ref'] for r in records}), 4)
        for record in records:
            photo = record['photos'][0]
            actual = (self.log.parent / photo['rel_path']).read_bytes()
            self.assertEqual(hashlib.sha256(actual).hexdigest(), photo['sha256'])

    def test_failed_log_write_rolls_back_only_the_new_photos(self):
        record = {'metadata': {}}
        photo = dict(index=1, ext='.jpg', bytes=b'fixture', original_name='fixture.jpg',
                     mime_type='image/jpeg', size_bytes=7, sha256=hashlib.sha256(b'fixture').hexdigest())
        saved = server.persist_dossier(record, [photo], self.log, 'SOL-2026-AAAA')
        original_photo = self.log.parent / saved['photos'][0]['rel_path']
        with patch.object(server, 'persist_inquiry', side_effect=OSError('disk full')):
            with self.assertRaises(OSError):
                server.persist_dossier(record, [photo], self.log, 'SOL-2026-AAAA')
        self.assertEqual(original_photo.read_bytes(), b'fixture')
        self.assertEqual(len(list((self.log.parent / 'photos').iterdir())), 1)

    def test_failed_fsync_restores_previous_log_bytes(self):
        server.persist_inquiry({'ref': 'SOL-2026-AAAA'}, self.log)
        previous = self.log.read_bytes()
        actual_fsync = server.os.fsync
        calls = 0

        def fail_once(fd):
            nonlocal calls
            calls += 1
            if calls == 1:
                raise OSError('fsync failure fixture')
            return actual_fsync(fd)

        with patch.object(server.os, 'fsync', fail_once):
            with self.assertRaises(OSError):
                server.persist_inquiry({'ref': 'SOL-2026-BBBB'}, self.log)
        self.assertEqual(self.log.read_bytes(), previous)

    def test_non_finite_timestamps_are_rejected_without_dropping_connection(self):
        for timestamp in ['NaN', 'Infinity', '-Infinity']:
            payload = dict(client_name='Audit fixture', client_email='audit@example.invalid',
                           location='Porto', form_loaded_at=timestamp)
            with self.subTest(timestamp=timestamp):
                status, body = self.request('POST', '/api/inquiry', payload)
                self.assertEqual(status, 400)
                self.assertEqual(json.loads(body)['error'], 'SPAM_TEMPORAL_THRESHOLD_VIOLATED')
        self.assertFalse(self.log.exists())

    def test_corrupt_log_blocks_reference_reservation_without_mutation(self):
        self.log.write_text('{"ref":"SOL-2026-AAAA"}\ntruncated record')
        previous = self.log.read_bytes()
        with self.assertRaises(json.JSONDecodeError):
            server.persist_dossier({'metadata': {}}, [], self.log, 'SOL-2026-AAAA')
        self.assertEqual(self.log.read_bytes(), previous)
        self.assertFalse((self.log.parent / 'photos').exists())

    def test_serializer_waits_for_selected_photos_before_reading_snapshot(self):
        js = (ROOT / 'js/main.js').read_text()
        serializer = 'async function serializeIntakePhotos' + js.split(
            '  async function serializeIntakePhotos', 1)[1].split('  async function transmitInquiry', 1)[0]
        code = r'''
const assert = require('node:assert/strict');
let release;
const intake = {photos: [], ref: 'SOL-TEST', pending: new Promise(r => release = r)};
const photoIntakes = new Map([['form', intake]]);
class FileReader {
  readAsDataURL(blob) { this.result = 'data:image/jpeg;base64,/9j/'; this.onload(); }
}
''' + serializer + r'''
(async () => {
  let done = false;
  const serialized = serializeIntakePhotos('form').then(p => {done = true; return p;});
  await Promise.resolve();
  assert.equal(done, false, 'Submission must wait for compression');
  intake.photos.push({blob: {type: 'image/jpeg', size: 3}, name: 'selected.jpg'});
  release();
  const result = await serialized;
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'selected.jpg');
})().catch(e => {console.error(e); process.exitCode = 1;});
'''
        result = subprocess.run(['node', '-e', code], capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_translation_values_do_not_contain_encoded_text_entities(self):
        script = "const i=require('./js/i18n.js');for(const [l,d] of Object.entries(i.TRANSLATIONS))for(const [k,v] of Object.entries(d))if(/&(?:amp|copy|lt|gt);/.test(v))throw Error(l+':'+k);"
        result = subprocess.run(['node', '-e', script], cwd=ROOT, capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == '__main__':
    unittest.main()
