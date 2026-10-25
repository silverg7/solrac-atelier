"""SOL-11: real photo provenance, decoding and interaction in the served DOM."""
import hashlib
import json
import re
import unittest

from scripts import test_visual_chroma as browser_support

ROOT = browser_support.ROOT
PROJECTS = json.loads(re.search(r'const PROJECTS_DATA = (\[.*?\]);',
                               (ROOT / 'js/main.js').read_text(), re.S)[1])


class GalleryData(unittest.TestCase):
    def test_distinct_real_photographs_owned_by_each_project(self):
        manifest = json.loads((ROOT / 'assets/images/manifest.json').read_text())
        sources = {f['path']: (image, f) for image in manifest['images'] for f in image['files']}
        all_photos = set()
        for project in PROJECTS:
            with self.subTest(project=project['id']):
                self.assertTrue(2 <= len(project['gallery']) <= 4)
                self.assertEqual(project['gallery'][0]['image'], project['image'])
                positions, hashes = set(), set()
                for photo in project['gallery']:
                    image, file = sources[photo['image']]
                    self.assertEqual(image['project_id'], project['id'])
                    self.assertEqual(sources[photo['thumbnail']][0], image)
                    self.assertEqual((photo['width'], photo['height']), (file['width'], file['height']))
                    self.assertTrue(photo['alt'].strip())
                    self.assertIn(photo['kind'], ['conjunto', 'aparejo', 'textura', 'remate'])
                    self.assertNotIn(photo['image'], all_photos)
                    all_photos.add(photo['image'])
                    positions.add(image['album_position'])
                    hashes.add(hashlib.sha256((ROOT / photo['image']).read_bytes()).hexdigest())
                self.assertEqual(len(positions), len(project['gallery']))
                self.assertEqual(len(hashes), len(project['gallery']))


class GalleryDOM(unittest.TestCase):
    setUpClass = classmethod(browser_support.ChromaRendering.setUpClass.__func__)
    setUp = browser_support.ChromaRendering.setUp
    tearDown = browser_support.ChromaRendering.tearDown

    def setUp(self):
        browser_support.ChromaRendering.setUp(self)
        self.failed = []
        self.page.on('response', lambda response: self.failed.append(response.url) if response.status >= 400 else None)

    def photo_loaded(self, photo):
        image = self.page.locator('#lightbox-image')
        self.page.wait_for_function('(path) => document.querySelector("#lightbox-image").getAttribute("src") === path', arg=photo['image'])
        image.evaluate('(img) => img.decode()')
        self.assertEqual(image.evaluate('(img) => [img.naturalWidth, img.naturalHeight]'),
                         [photo['width'], photo['height']])

    def test_all_projects_click_keyboard_and_project_navigation(self):
        page = self.page
        for project in PROJECTS:
            page.locator(f'.project-card[data-id="{project["id"]}"]').click()
            title = page.locator('#lightbox-title').inner_text()
            image = page.locator('#lightbox-image').element_handle()
            buttons = page.locator('#lightbox-photos button')
            self.assertEqual(buttons.count(), len(project['gallery']))
            self.photo_loaded(project['gallery'][0])
            scroll = page.evaluate('() => [window.scrollY, document.querySelector(".lightbox-dialog").scrollTop]')
            buttons.nth(1).click()
            self.photo_loaded(project['gallery'][1])
            self.assertEqual(page.locator('#lightbox-title').inner_text(), title)
            self.assertTrue(image.evaluate('(img) => img === document.querySelector("#lightbox-image")'))
            buttons.nth(1).press('ArrowRight')  # wrap within this work
            self.photo_loaded(project['gallery'][0])
            self.assertEqual(buttons.nth(0).get_attribute('aria-pressed'), 'true')
            self.assertTrue(buttons.nth(0).evaluate('(b) => b === document.activeElement'))
            buttons.nth(0).press('End')
            self.photo_loaded(project['gallery'][-1])
            buttons.nth(1).press('Home')
            self.photo_loaded(project['gallery'][0])
            self.assertEqual(page.evaluate('() => [window.scrollY, document.querySelector(".lightbox-dialog").scrollTop]'), scroll)
            page.locator('#lightbox-technical-tab').click()
            self.assertTrue(page.locator('#lightbox-photos').is_hidden())
            page.locator('#lightbox-photo-tab').click()
            self.photo_loaded(project['gallery'][0])
            page.keyboard.press('Escape')
        page.locator('.project-card').first.click()
        page.locator('#lightbox-photos button').nth(1).click()
        page.locator('#lightbox-next').click()
        self.photo_loaded(PROJECTS[1]['gallery'][0])
        page.locator('#lightbox-prev').focus()
        page.keyboard.press('ArrowLeft')
        self.photo_loaded(PROJECTS[0]['gallery'][0])
        page.locator('#lightbox-prev').click()
        self.photo_loaded(PROJECTS[-1]['gallery'][0])
        self.assertEqual(self.failed, [])

    def test_responsive_focus_language_and_rapid_selection(self):
        page = self.page
        for width in [320, 390, 1024, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.locator('.project-card').first.click()
            selector = page.locator('#lightbox-photos')
            selector.locator('button').nth(1).click()
            self.photo_loaded(PROJECTS[0]['gallery'][1])
            for lang, label in [('en', 'Finishing detail'), ('es', 'Remate'), ('pt', 'Remate')]:
                page.evaluate('(lang) => I18N.setLanguage(lang)', lang)
                self.photo_loaded(PROJECTS[0]['gallery'][1])
                self.assertIn(label, selector.inner_text())
            page.evaluate('''() => {
              const buttons = document.querySelectorAll('#lightbox-photos button');
              for(let i=0;i<20;i++) buttons[i%2].click();
            }''')
            self.photo_loaded(PROJECTS[0]['gallery'][1])
            bounds = selector.bounding_box()
            image = page.locator('#lightbox-image').bounding_box()
            self.assertLessEqual(image['y'] + image['height'], bounds['y'])
            self.assertLessEqual(selector.evaluate('(e) => e.scrollWidth'), width - 32)
            self.assertLessEqual(page.locator('#lightbox-modal').evaluate('(e) => e.scrollWidth'), width)
            for _ in range(12):
                page.keyboard.press('Tab')
                self.assertTrue(page.locator(':focus').evaluate('(e) => !!e.closest("#lightbox-modal")'))
            page.keyboard.press('Escape')
            self.assertTrue(page.locator('.project-card').first.evaluate('(e) => e === document.activeElement'))
        self.assertEqual(self.failed, [])


if __name__ == '__main__':
    unittest.main()
