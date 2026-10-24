"""SOL-10: CSS contract and real hover rendering on the local site.

Requires requirements-browser.txt and Chrome/Chromium (SOLRAC_BROWSER overrides
the executable). Missing browser dependencies fail the gate rather than skip it.
"""
import os
import re
import shutil
import threading
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright
from scripts.server import InquiryRequestHandler, ThreadedInquiryServer

ROOT = Path(__file__).resolve().parents[1]


class ChromaCSS(unittest.TestCase):
    def test_scoped_hover_and_filter_transitions(self):
        css = (ROOT / 'css/style.css').read_text()

        def rule(selector):
            return re.search(r'(?m)^' + re.escape(selector) + r'\s*\{([^}]+)\}', css)[1]

        self.assertIn('filter: grayscale(100%) contrast(110%)', rule('img'))
        for container, image in [('.hero-visual-frame', '.hero-visual-frame img'),
                                 ('.project-card', '.project-thumb-wrapper img'),
                                 ('.photo-thumbnail', '.photo-thumbnail img')]:
            with self.subTest(image=image):
                hover = (container + ':hover .project-thumb-wrapper img' if container == '.project-card'
                         else container + ':hover img')
                self.assertIn('filter: grayscale(0%) contrast(100%)', rule(hover))
                self.assertIn('filter 0.6s var(--ease-tectonic)', rule(image))


class ChromaRendering(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class Handler(InquiryRequestHandler):
            def log_message(self, *args):
                pass

        cls.server = ThreadedInquiryServer(('127.0.0.1', 0), Handler)
        cls.addClassCleanup(cls.server.server_close)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.addClassCleanup(cls.server.shutdown)
        cls.base = f'http://127.0.0.1:{cls.server.server_address[1]}'
        cls.playwright = sync_playwright().start()
        cls.addClassCleanup(cls.playwright.stop)
        executable = (os.environ.get('SOLRAC_BROWSER') or shutil.which('google-chrome')
                      or shutil.which('chromium'))
        if not executable:
            raise RuntimeError('Chrome/Chromium required; set SOLRAC_BROWSER.')
        cls.browser = cls.playwright.chromium.launch(executable_path=executable, headless=True)
        cls.addClassCleanup(cls.browser.close)

    def setUp(self):
        self.page = self.browser.new_page(viewport={'width': 1440, 'height': 1000})
        self.addCleanup(self.page.close)
        # Avoid timing/network dependence on remote font providers.
        self.page.route('https://fonts.googleapis.com/**', lambda route: route.abort())
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.goto(self.base)
        self.page.evaluate('document.fonts.ready')
        self.page.evaluate("document.documentElement.style.scrollBehavior = 'auto'")

    def tearDown(self):
        self.assertEqual(self.errors, [])

    def assert_hover_cycle(self, container, image):
        page = self.page
        page.mouse.move(0, 0)
        container.scroll_into_view_if_needed()
        image.evaluate('(img) => img.decode()')
        page.wait_for_timeout(650)
        rest = image.evaluate('''img => {
          const s = getComputedStyle(img);
          const index = s.transitionProperty.split(', ').indexOf('filter');
          return {filter:s.filter, duration:s.transitionDuration.split(', ')[index],
                  ease:s.transitionTimingFunction, token:s.getPropertyValue('--ease-tectonic').trim()};
        }''')
        self.assertRegex(rest['filter'], r'^grayscale\(1\)(?: contrast\(1\.1\))?$')
        self.assertEqual(rest['duration'], '0.6s')
        self.assertIn(rest['token'], rest['ease'])
        geometry = image.evaluate('''img => {
          window.chromaGeometry = () => [img, img.parentElement, img.parentElement.parentElement]
            .map(e => [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight]);
          window.chromaShifts = [];
          window.chromaObserver = new PerformanceObserver(list =>
            window.chromaShifts.push(...list.getEntries().map(e => e.value)));
          window.chromaObserver.observe({type:'layout-shift'});
          return window.chromaGeometry();
        }''')
        container.hover()
        # Sample animation frames instead of assuming the first paint happens
        # within a fixed wall-clock delay on a loaded host.
        page.wait_for_function('''img => {
          const value = parseFloat(getComputedStyle(img).filter.match(/grayscale\\(([^)]+)/)[1]);
          return value > 0 && value < 1;
        }''', arg=image.element_handle(), timeout=2000)
        page.wait_for_function('(img) => getComputedStyle(img).filter === "grayscale(0) contrast(1)"',
                               arg=image.element_handle())
        # Also let the hero zoom finish before measuring layout stability.
        page.wait_for_timeout(1250)
        self.assertEqual(image.evaluate('window.chromaGeometry()'), geometry)
        page.mouse.move(0, 0)
        page.wait_for_timeout(1250)
        self.assertEqual(image.evaluate('img => getComputedStyle(img).filter'), rest['filter'])
        self.assertEqual(image.evaluate('window.chromaGeometry()'), geometry)
        shifts = page.evaluate('''() => {
          chromaObserver.disconnect();
          return chromaShifts;
        }''')
        # Include recent-input entries too: a hover must never move page layout.
        self.assertEqual(sum(shifts), 0, shifts)

    def test_hero_and_every_project_reveal_and_restore_without_layout_shifts(self):
        for width in (1440, 390):
            self.page.set_viewport_size({'width': width, 'height': 1000})
            hero = self.page.locator('.hero-visual-frame')
            with self.subTest(width=width, target='hero'):
                self.assert_hover_cycle(hero, hero.locator('img'))
            cards = self.page.locator('.project-card')
            self.assertGreater(cards.count(), 0)
            for index in range(cards.count()):
                with self.subTest(width=width, project=index):
                    card = cards.nth(index)
                    self.assert_hover_cycle(card, card.locator('img'))

    def test_real_photo_previews_in_both_forms_reveal_and_restore(self):
        for modal in (False, True):
            with self.subTest(modal=modal):
                if modal:
                    self.page.locator('#header-concierge-btn').click()
                form = self.page.locator('#concierge-modal-form' if modal else '#concierge-form')
                form.locator('input[type=file]').set_input_files(
                    str(ROOT / 'assets/images/hero/cantaria-esquina-640.webp'))
                preview = form.locator('.photo-thumbnail')
                preview.wait_for(state='visible')
                self.assert_hover_cycle(preview, preview.locator('img'))


if __name__ == '__main__':
    unittest.main()
