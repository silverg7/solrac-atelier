"""SOL-09: discoverable styles, real PWA assets and crawler-readable metadata.

Contract references: https://ogp.me/, https://schema.org/HomeAndConstructionBusiness
and https://schema.org/hasOfferCatalog. Tests run offline against the real server.
"""
import json
import re
import struct
import threading
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen

from scripts.server import InquiryRequestHandler, ThreadedInquiryServer

ROOT = Path(__file__).resolve().parents[1]


class HeadAndAssets(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.links, self.meta, self.assets, self.schemas = [], {}, set(), []
        self.in_schema = False
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link':
            self.links.append(attrs)
            if attrs.get('rel') in {'stylesheet', 'icon', 'apple-touch-icon', 'manifest', 'preload'}:
                self.assets.add(attrs['href'])
        if tag == 'meta':
            key = attrs.get('property', attrs.get('name'))
            if key in self.meta:
                raise AssertionError(f'Duplicate metadata: {key}')
            self.meta[key] = attrs.get('content', '')
        if tag in {'img', 'script', 'source'}:
            if attrs.get('src'):
                self.assets.add(attrs['src'])
            for item in attrs.get('srcset', '').split(','):
                if item.strip():
                    self.assets.add(item.strip().split()[0])
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_schema = True

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_schema = False

    def handle_data(self, data):
        if self.in_schema:
            self.schemas.append(json.loads(data))


class PerformanceSEO(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class Handler(InquiryRequestHandler):
            def log_message(self, *args):
                pass

        cls.server = ThreadedInquiryServer(('127.0.0.1', 0), Handler)
        cls.addClassCleanup(cls.server.server_close)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.addClassCleanup(cls.server.shutdown)
        cls.base = f'http://127.0.0.1:{cls.server.server_address[1]}/'
        with urlopen(cls.base, timeout=5) as response:
            cls.html = response.read().decode()
        cls.doc = HeadAndAssets(cls.html)
        cls.manifest_link = next(x['href'] for x in cls.doc.links if x['rel'] == 'manifest')
        cls.manifest = json.loads((ROOT / cls.manifest_link).read_text())

    def assert_https(self, value):
        parsed = urlsplit(value)
        self.assertEqual(parsed.scheme, 'https')
        self.assertTrue(parsed.hostname)
        self.assertFalse(parsed.fragment)

    def public_asset_path(self, url):
        canonical = urlsplit(self.doc.meta['og:url'])
        asset = urlsplit(url)
        self.assertEqual(asset.netloc, canonical.netloc)
        self.assertTrue(asset.path.startswith(canonical.path), url)
        return asset.path[len(canonical.path):]

    def test_styles_discovered_without_import_chain_and_fonts_nonblocking(self):
        for css in (ROOT / 'css').glob('*.css'):
            self.assertNotRegex(css.read_text(), r'(?i)@import\b', str(css))
        local_styles = [x['href'] for x in self.doc.links
                        if x['rel'] == 'stylesheet' and not urlsplit(x['href']).netloc]
        self.assertEqual(local_styles, ['css/variables.css', 'css/typography.css', 'css/style.css'])
        font_links = [x for x in self.doc.links if urlsplit(x['href']).netloc == 'fonts.googleapis.com'
                      and x['rel'] in {'preload', 'stylesheet'}]
        preload = next(x for x in font_links if x['rel'] == 'preload')
        self.assertEqual(preload['as'], 'style')
        self.assertIn("this.rel='stylesheet'", preload['onload'])
        self.assertIn('display=swap', preload['href'])
        self.assertRegex(self.html, r'(?s)<noscript>\s*<link rel="stylesheet"[^>]+fonts.googleapis.com')
        self.assertEqual([x['href'] for x in font_links], [preload['href']] * 2)

    def test_manifest_identity_scope_and_theme(self):
        manifest = self.manifest
        self.assertEqual(manifest['name'], 'SOLRAC TECTONICS')
        self.assertEqual(manifest['short_name'], 'SOLRAC')
        self.assertEqual(manifest['lang'], 'pt-PT')
        self.assertEqual(manifest['display'], 'standalone')
        self.assertEqual(manifest['theme_color'], '#070707')
        self.assertEqual(manifest['background_color'], '#070707')
        self.assertEqual(self.doc.meta['theme-color'], '#070707')
        for key in ('id', 'start_url', 'scope'):
            self.assertEqual(urljoin(urljoin(self.base, self.manifest_link), manifest[key]), self.base)
        self.assertEqual({x['sizes'] for x in manifest['icons']}, {'192x192', '512x512'})

    def test_icon_binary_dimensions_and_tiny_svg(self):
        for name, size in [('icon-192.png', 192), ('icon-512.png', 512), ('apple-touch-icon.png', 180)]:
            data = (ROOT / 'assets/icons' / name).read_bytes()
            self.assertEqual(data[:8], b'\x89PNG\r\n\x1a\n')
            self.assertEqual(struct.unpack('>II', data[16:24]), (size, size))
            self.assertGreater(len(data), 1000)
        data = (ROOT / 'assets/icons/favicon.ico').read_bytes()
        reserved, kind, count = struct.unpack('<HHH', data[:6])
        self.assertEqual((reserved, kind, count), (0, 1, 3))
        self.assertEqual({tuple(data[6 + i * 16:8 + i * 16]) for i in range(count)},
                         {(16, 16), (32, 32), (48, 48)})
        svg = ET.parse(ROOT / 'assets/icons/favicon.svg').getroot()
        self.assertEqual(svg.attrib['version'], '1.2')
        self.assertEqual(svg.attrib['baseProfile'], 'tiny')
        self.assertFalse(any(x.tag.rsplit('}', 1)[-1] in {'filter', 'foreignObject'} for x in svg.iter()))
        self.assertFalse(any('filter' in x.attrib for x in svg.iter()))

    def test_social_cards_are_complete_and_consistent(self):
        meta = self.doc.meta
        for key in ('og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'og:site_name',
                    'og:locale', 'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt',
                    'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'):
            self.assertTrue(meta[key].strip(), key)
        self.assertEqual(meta['og:type'], 'website')
        self.assertEqual(meta['og:locale'], 'pt_PT')
        self.assertEqual(meta['twitter:card'], 'summary_large_image')
        canonical = next(x['href'] for x in self.doc.links if x['rel'] == 'canonical')
        self.assert_https(canonical)
        self.assertEqual(meta['og:url'], canonical)
        for field in ('title', 'description', 'image', 'image:alt'):
            self.assertEqual(meta['og:' + field], meta['twitter:' + field])
        self.assert_https(meta['og:image'])
        self.assertLessEqual(len(meta['twitter:title']), 70)
        self.assertLessEqual(len(meta['twitter:description']), 200)
        image_path = self.public_asset_path(meta['og:image'])
        manifest = json.loads((ROOT / 'assets/images/manifest.json').read_text())
        photo = next(f for img in manifest['images'] for f in img['files'] if f['path'] == image_path)
        self.assertEqual(meta['og:image:type'], 'image/webp')
        self.assertEqual(int(meta['og:image:width']), photo['width'])
        self.assertEqual(int(meta['og:image:height']), photo['height'])
        self.assertLess(photo['bytes'], 5 * 1024 * 1024)

    def test_schema_org_business_and_service_property_ranges(self):
        self.assertEqual(len(self.doc.schemas), 1)
        schema = self.doc.schemas[0]
        self.assertEqual(schema['@context'], 'https://schema.org')
        self.assertEqual(schema['@type'], 'HomeAndConstructionBusiness')
        self.assertEqual(schema['url'], self.doc.meta['og:url'])
        self.assertEqual(schema['@id'], schema['url'] + '#atelier')
        for field in ('name', 'alternateName', 'description'):
            self.assertIsInstance(schema[field], str)
            self.assertTrue(schema[field])
        self.assertEqual(schema['address']['@type'], 'PostalAddress')
        self.assertEqual(schema['address']['addressCountry'], 'PT')
        self.assertEqual(schema['image']['@type'], 'ImageObject')
        self.assertEqual(schema['image']['contentUrl'], self.doc.meta['og:image'])
        for dimension in ('width', 'height'):
            self.assertEqual(schema['image'][dimension], {
                '@type': 'QuantitativeValue',
                'value': int(self.doc.meta['og:image:' + dimension]), 'unitCode': 'E37'})
        self.assert_https(schema['logo'])
        self.assertGreaterEqual(len(schema['areaServed']), 2)
        for area in schema['areaServed']:
            self.assertEqual(area['@type'], 'AdministrativeArea')
            self.assertIsInstance(area['name'], str)
        catalog = schema['hasOfferCatalog']
        self.assertEqual(catalog['@type'], 'OfferCatalog')
        self.assertIsInstance(catalog['name'], str)
        self.assertGreaterEqual(len(catalog['itemListElement']), 3)
        for offer in catalog['itemListElement']:
            self.assertEqual(offer['@type'], 'Offer')
            service = offer['itemOffered']
            self.assertEqual(service['@type'], 'Service')
            self.assertIsInstance(service['name'], str)
            self.assertEqual(service['provider'], {'@id': schema['@id']})

    def test_all_referenced_local_assets_serve_http_200(self):
        assets = {urljoin(self.base, x) for x in self.doc.assets if not urlsplit(x).netloc}
        for css in (ROOT / 'css').glob('*.css'):
            for match in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css.read_text()):
                if not urlsplit(match).scheme:
                    assets.add(urljoin(urljoin(self.base, str(css.relative_to(ROOT))), match))
        for icon in self.manifest['icons']:
            assets.add(urljoin(urljoin(self.base, self.manifest_link), icon['src']))
        # Public crawler URLs map to the same files on the local verification server.
        for source in (self.doc.meta['og:image'], self.doc.schemas[0]['logo']):
            assets.add(urljoin(self.base, self.public_asset_path(source)))
        projects = json.loads(re.search(r'const PROJECTS_DATA = (\[.*?\]);',
                                       (ROOT / 'js/main.js').read_text(), re.S)[1])
        for project in projects:
            for width in (640, 1280, 1920):
                assets.add(urljoin(self.base, f"{project['imageBase']}-{width}.webp"))
        for url in sorted(assets):
            with self.subTest(url=url), urlopen(url, timeout=5) as response:
                self.assertEqual(response.status, 200)
                self.assertTrue(response.read())
                if url.endswith('.webmanifest'):
                    self.assertIn(response.headers.get_content_type(),
                                  {'application/manifest+json', 'application/json'})
