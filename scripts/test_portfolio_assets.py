"""SOL-02: caminhos locais, cobertura do portfolio e orçamento de transferência."""

import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Images(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.images = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            self.images.append(dict(attrs))


class PortfolioAssets(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads((ROOT / "assets/images/manifest.json").read_text())
        cls.js = (ROOT / "js/main.js").read_text()
        cls.projects = json.loads(re.search(r"const PROJECTS_DATA = (\[.*?\]);", cls.js, re.S)[1])
        cls.images = Images((ROOT / "index.html").read_text()).images
        cls.files = {f["path"]: f for image in cls.manifest["images"] for f in image["files"]}

    def test_photographs_exist_and_fit_transfer_budget(self):
        for image in self.manifest["images"]:
            with self.subTest(image=image["stem"]):
                self.assertGreaterEqual(max(image["source_dimensions"]), 1920)
                self.assertEqual({f["width"] for f in image["files"]}, {640, 1280, 1920})
            for file in image["files"]:
                with self.subTest(path=file["path"]):
                    data = (ROOT / file["path"]).read_bytes()
                    self.assertEqual(data[:4], b"RIFF")
                    self.assertEqual(data[8:12], b"WEBP")
                    self.assertEqual(len(data), file["bytes"])
                    self.assertLessEqual(len(data), 700 * 1024)
                    if file["width"] == 640:
                        self.assertLessEqual(len(data), 100 * 1024)
        self.assertLessEqual(sum(f["bytes"] for f in self.files.values()), 8 * 1024 * 1024)

    def test_project_sources_cover_the_filters(self):
        self.assertEqual({p["category"] for p in self.projects}, {"muros", "quintas", "cantaria"})
        self.assertEqual(len({p["id"] for p in self.projects}), len(self.projects))
        for project in self.projects:
            with self.subTest(project=project["id"]):
                self.assertTrue(project["alt"].strip())
                for width in (640, 1280, 1920):
                    self.assertIn(f'{project["imageBase"]}-{width}.webp', self.files)
                full = self.files[project["image"]]
                self.assertEqual((project["width"], project["height"]), (full["width"], full["height"]))

    def test_cover_and_markup_have_no_missing_sources(self):
        cover = next(img for img in self.images if img.get("fetchpriority") == "high")
        self.assertIn(cover["src"], self.files)
        self.assertEqual(cover["width"], str(self.files[cover["src"]]["width"]))
        self.assertEqual(cover["height"], str(self.files[cover["src"]]["height"]))
        for img in self.images:
            for candidate in img.get("srcset", "").split(","):
                if candidate.strip():
                    self.assertIn(candidate.strip().split()[0], self.files)
            if "src" in img:
                self.assertTrue(img["src"])
                self.assertTrue((ROOT / img["src"]).is_file())


if __name__ == "__main__":
    unittest.main()
