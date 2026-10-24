"""Real Chromium regressions. Run with `make check-browser` (Playwright + Chrome)."""
import json
import os
import shutil
import tempfile
import threading
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright
from scripts.server import InquiryRequestHandler, ThreadedInquiryServer

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / 'scratch/sol-bug-03'


class BrowserRegressionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='solrac_browser_')
        cls.addClassCleanup(cls.temp.cleanup)
        cls.log = Path(cls.temp.name) / 'inquiries.jsonl'

        class Handler(InquiryRequestHandler):
            inquiries_file = cls.log

            def log_message(self, *args):
                pass

        cls.server = ThreadedInquiryServer(('127.0.0.1', 0), Handler)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.addClassCleanup(cls.server.server_close)
        cls.addClassCleanup(cls.server.shutdown)
        cls.base = f'http://127.0.0.1:{cls.server.server_address[1]}'
        cls.playwright = sync_playwright().start()
        cls.addClassCleanup(cls.playwright.stop)
        executable = os.environ.get('SOLRAC_BROWSER') or shutil.which('google-chrome') or shutil.which('chromium')
        if not executable:
            raise RuntimeError('Chrome/Chromium required; set SOLRAC_BROWSER to its executable.')
        cls.browser = cls.playwright.chromium.launch(executable_path=executable, headless=True)
        cls.addClassCleanup(cls.browser.close)
        ARTIFACTS.mkdir(parents=True, exist_ok=True)

    def setUp(self):
        self.page = self.browser.new_page(viewport={'width': 1440, 'height': 1000})
        self.addCleanup(self.page.close)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.goto(self.base)
        self.page.evaluate('document.fonts.ready')
        self.page.evaluate("I18N.setLanguage('pt')")

    def tearDown(self):
        self.assertEqual(self.errors, [])

    def fill_form(self, modal=False):
        prefix = 'modal_' if modal else ''
        self.page.locator(f'#{prefix}client_name').fill('Audit fixture <safe> & name')
        self.page.locator(f'#{prefix}client_email').fill('audit@example.invalid')
        self.page.locator(f'#{prefix}location').fill('Porto')

    def test_responsive_layout_and_header_controls_in_three_languages(self):
        for language in ['pt', 'en', 'es']:
            self.page.evaluate('(l)=>I18N.setLanguage(l)', language)
            for width, height in [(320, 568), (390, 844), (768, 1024), (800, 900),
                                  (1024, 768), (1200, 900), (1279, 900), (1280, 900), (1440, 1000)]:
                with self.subTest(language=language, width=width):
                    self.page.set_viewport_size({'width': width, 'height': height})
                    sizes = self.page.evaluate('''()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
                      outside:[...document.querySelectorAll('.header a,.header button')].filter(e=>{
                        if(!e.getClientRects().length)return false;
                        const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;
                      }).map(e=>e.id||e.textContent.trim())})''')
                    self.assertLessEqual(sizes['scroll'], width, sizes)
                    self.assertEqual(sizes['outside'], [], sizes)
                    if width < 1280:
                        self.page.locator('#mobile-toggle').click()
                        self.assertTrue(self.page.locator('.mobile-nav-cta [data-concierge-open]').is_visible())
                        self.page.keyboard.press('Escape')
                    if language == 'pt' and width in [320, 800, 1440]:
                        self.page.screenshot(path=str(ARTIFACTS / f'viewport-{width}.png'))
        encoded = self.page.locator('[data-i18n]').evaluate_all(
            "es=>es.filter(e=>e.getClientRects().length&&/&(?:amp|copy);/.test(e.textContent)).map(e=>e.dataset.i18n)")
        self.assertEqual(encoded, [])

    def test_photo_compression_finishes_before_real_submission(self):
        self.fill_form()
        self.page.evaluate('''()=>{const decode=Image.prototype.decode;
          Image.prototype.decode=async function(){await new Promise(r=>window.resumeDecode=r);return decode.call(this)}}''')
        self.page.locator('#inpage-photos').set_input_files(str(ROOT / 'assets/images/hero/cantaria-esquina-640.webp'))
        requests = []
        self.page.on('request', lambda request: requests.append(request.post_data_json)
                     if request.method == 'POST' and request.url.endswith('/api/inquiry') else None)
        self.page.locator('#concierge-form button[type=submit]').click()
        self.page.wait_for_timeout(100)
        self.assertEqual(requests, [])
        self.assertTrue(self.page.locator('#concierge-form button[type=submit]').is_disabled())
        # Human time threshold is independent of the held image decoder.
        self.page.wait_for_timeout(1500)
        self.page.evaluate('resumeDecode()')
        self.page.locator('#inpage-feedback-card').wait_for(state='visible')
        self.assertEqual(len(requests), 1)
        self.assertEqual(len(requests[0]['photos']), 1)
        self.assertTrue(self.page.locator('#inpage-photos').is_disabled())
        self.assertEqual(self.page.locator('#inpage-feedback-card .photo-thumbnail button').count(), 0)
        self.assertEqual(self.page.locator('#inpage-feedback-card .feedback-title').inner_text(), 'PEDIDO RECEBIDO')
        records = [json.loads(line) for line in self.log.read_text().splitlines()]
        self.assertTrue(any(record['photos'] and record['metadata']['photo_count'] == 1 for record in records))
        self.page.set_viewport_size({'width': 320, 'height': 568})
        self.assertEqual(self.page.evaluate('document.documentElement.scrollWidth'), 320)
        self.page.locator('#inpage-feedback-reset').click()
        self.assertEqual(self.page.locator('#concierge-form .photo-thumbnail').count(), 0)
        self.assertEqual(self.page.locator('#client_name').input_value(), '')
        self.assertEqual(self.page.locator(':focus').get_attribute('id'), 'client_name')

    def test_late_modal_response_survives_close_reopen_and_language_changes(self):
        self.page.locator('#header-concierge-btn').click()
        self.fill_form(modal=True)
        routes = []
        self.page.route('**/api/inquiry', lambda route: routes.append(route))
        self.page.locator('#concierge-modal-form button[type=submit]').click()
        self.page.wait_for_timeout(100)
        self.assertEqual(len(routes), 1)
        self.page.locator('#concierge-modal-form').evaluate('(f)=>f.requestSubmit()')
        self.assertEqual(len(routes), 1)
        self.page.keyboard.press('Escape')
        self.page.wait_for_timeout(450)
        routes[0].fulfill(status=201, content_type='application/json', body='{"ok":true,"ref":"SOL-2026-TEST"}')
        self.page.wait_for_timeout(100)
        self.assertEqual(self.page.locator(':focus').get_attribute('id'), 'header-concierge-btn')
        self.page.locator('#header-concierge-btn').click()
        self.assertTrue(self.page.locator('#modal-feedback-card').is_visible())
        self.assertFalse(self.page.locator('#concierge-modal-form').is_visible())
        for language, title in [('en', 'INQUIRY RECEIVED'), ('es', 'SOLICITUD RECIBIDA'), ('pt', 'PEDIDO RECEBIDO')]:
            self.page.evaluate('(l)=>I18N.setLanguage(l)', language)
            self.assertEqual(self.page.locator('#modal-feedback-card .feedback-title').inner_text(), title)
            self.assertIn('Audit fixture <safe> & name', self.page.locator('#modal-feedback-desc').inner_text())
            self.assertNotIn('{name}', self.page.locator('#modal-feedback-desc').inner_text())
            self.assertIn('SOL-2026-TEST', self.page.locator('#modal-feedback-desc').inner_text())
        self.page.locator('#modal-feedback-reset').click()
        self.assertTrue(self.page.locator('#concierge-modal-form').is_visible())
        self.assertEqual(self.page.locator('#modal_client_name').input_value(), '')
        self.assertEqual(self.page.locator(':focus').get_attribute('id'), 'modal_client_name')

    def test_keyboard_lightbox_technical_view_and_concierge_at_mobile_width(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        card = self.page.locator('.project-card').first
        card.focus()
        self.page.keyboard.press('Enter')
        self.page.locator('#lightbox-image').evaluate('(i)=>i.decode()')
        self.page.locator('#lightbox-technical-tab').click()
        self.assertTrue(self.page.locator('#lightbox-technical').is_visible())
        self.assertLessEqual(self.page.locator('#lightbox-modal').evaluate('(e)=>e.scrollWidth'), 390)
        for _ in range(15):
            self.page.keyboard.press('Tab')
            self.assertTrue(self.page.locator(':focus').evaluate('(e)=>!!e.closest("#lightbox-modal")'))
        self.page.locator('#lightbox-inquire-btn').click()
        notes = self.page.locator('#modal_project_notes').input_value()
        self.assertIn('\n', notes)
        self.assertNotIn('\\', notes)
        self.assertNotIn('{title}', notes)
        for _ in range(22):
            self.page.keyboard.press('Shift+Tab')
            self.assertTrue(self.page.locator(':focus').evaluate('(e)=>!!e.closest("#concierge-modal")'))
        self.assertLessEqual(self.page.locator('#concierge-modal').evaluate('(e)=>e.scrollWidth'), 390)
        self.page.keyboard.press('Escape')
        self.assertEqual(self.page.locator(':focus').get_attribute('data-id'), card.get_attribute('data-id'))

    def test_offline_feedback_is_localized_and_never_claims_delivery(self):
        self.page.evaluate("I18N.setLanguage('en')")
        self.fill_form()
        self.page.route('**/api/inquiry', lambda route: route.abort())
        self.page.locator('#concierge-form button[type=submit]').click()
        self.page.locator('#inpage-feedback-card').wait_for(state='visible')
        self.assertEqual(self.page.locator('#inpage-feedback-card .feedback-title').inner_text(), 'INQUIRY PENDING SUBMISSION')
        self.assertIn('MANUAL SUBMISSION REQUIRED', self.page.locator('#inpage-feedback-card').inner_text())
        self.assertEqual(self.page.locator('#inpage-feedback-card .feedback-icon').inner_text(), '!')


if __name__ == '__main__':
    unittest.main()
