"""SOL-07: exercise production navigation events and canvas intake without libraries.

The Node adapter models only DOM APIs used by these components. Browser verification
also covers actual SVG visibility, JPEG decoding, responsive layout and gestures.
"""
import subprocess
import unittest
from pathlib import Path

from scripts.test_concierge_flow import TagCollector

ROOT = Path(__file__).resolve().parents[1]

ADAPTER = r"""
const assert = require('node:assert/strict');
class Element {
  constructor() {
    this.events = {}; this.dataset = {}; this.attributes = {}; this.children = [];
    this.style = {}; this.value = ''; this.textContent = ''; this.scrollTop = 120;
    const classes = new Set();
    this.classList = {add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c)};
  }
  addEventListener(name, fn) { (this.events[name] ||= []).push(fn); }
  async emit(name, event = {}) { for (const fn of this.events[name] || []) await fn(event); }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  toggleAttribute(k, on) { if(on) this.attributes[k] = ''; else delete this.attributes[k]; }
  closest() { return null; }
  replaceChildren() { this.children = []; }
  append(...elements) { this.children.push(...elements); }
  appendChild(el) { this.children.push(el); }
  before() {} after() {}
}
const elements = {};
const el = id => elements[id] ||= new Element();
const drawings = ['masonry', 'stone', 'drain'].map(type => {const d = new Element();d.dataset.technical = type;return d;});
const roots = [];
const document = new Element();
document.body = new Element();
document.getElementById = el;
document.querySelector = el;
document.querySelectorAll = selector => selector === '[data-technical]' ? drawings : roots;
document.createComment = () => new Element();
document.createElement = () => new Element();
const I18N = {t: key => key};
const PROJECTS_DATA = [{id:'a',category:'muros',specs:{}}, {id:'b',category:'muros',specs:{}}, {id:'c',category:'cantaria',specs:{}}];
const getLocalizedProject = p => p;
let activeFilter = 'all';
const conciergeModal = new Element();
"""


class LightboxNavigationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.js = (ROOT / 'js/main.js').read_text()
        cls.html = (ROOT / 'index.html').read_text()

    def run_js(self, code):
        result = subprocess.run(['node', '-e', code], capture_output=True, text=True, timeout=15)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_circular_navigation_events_and_scroll(self):
        navigation = self.js.split("  const lightboxModal =", 1)[1].split('     4. Concierge Desk', 1)[0]
        navigation = 'const lightboxModal =' + navigation.rsplit('  /*', 1)[0]
        self.run_js(ADAPTER + navigation + r"""
(async () => {
  const key = async (name, target = new Element()) => {
    let prevented = false;
    await document.emit('keydown', {key:name, target, preventDefault(){prevented=true;}});
    return prevented;
  };
  assert.equal(await key('ArrowRight'), false);
  openLightbox('missing'); assert.equal(activeLightboxProject, null);
  openLightbox('a'); assert.equal(el('lightbox-position').textContent, '1 / 3');
  await el('lightbox-prev').emit('click'); assert.equal(activeLightboxProject.id, 'c');
  await el('lightbox-next').emit('click'); assert.equal(activeLightboxProject.id, 'a');
  assert.equal(await key('ArrowRight'), true); assert.equal(activeLightboxProject.id, 'b');
  assert.equal(await key('ArrowLeft'), true); assert.equal(activeLightboxProject.id, 'a');
  for (let i=0;i<30;i++) navigateLightbox(-1);
  assert.equal(lightboxIndex, 0);
  const input = {closest: () => true};
  assert.equal(await key('ArrowRight', input), false); assert.equal(lightboxIndex, 0);
  conciergeModal.classList.add('active'); await key('ArrowRight'); assert.equal(lightboxIndex, 0);
  conciergeModal.classList.remove('active');
  const touch = (x,y) => ({clientX:x,clientY:y});
  const swipe = async (dx,dy) => {
    await lightboxViewer.emit('touchstart',{target:new Element(),touches:[touch(200,200)]});
    await lightboxViewer.emit('touchend',{touches:[],changedTouches:[touch(200+dx,200+dy)]});
  };
  await swipe(-90,4); assert.equal(activeLightboxProject.id, 'b');
  await swipe(90,4); assert.equal(activeLightboxProject.id, 'a');
  await swipe(10,100); assert.equal(activeLightboxProject.id, 'a');
  await lightboxViewer.emit('touchstart',{target:new Element(),touches:[touch(200,200),touch(210,210)]});
  await lightboxViewer.emit('touchend',{touches:[],changedTouches:[touch(20,200)]});
  assert.equal(activeLightboxProject.id,'a');
  await technicalTab.emit('click'); assert.equal(lightboxImage.hidden,true);
  technicalDetail.value = 'drain'; await technicalDetail.emit('change');
  assert.ok(!('hidden' in drawings[2].attributes)); assert.ok('hidden' in drawings[0].attributes);
  navigateLightbox(1); assert.equal(lightboxImage.hidden,true);
  assert.equal(lightboxViewer.scrollTop,120); assert.equal(document.body.style.overflow,'hidden');
  closeLightbox(); activeFilter='muros';openLightbox('a');
  assert.equal(lightboxImage.hidden,false);
  navigateLightbox(-1);assert.equal(activeLightboxProject.id,'b');
  assert.equal(el('lightbox-position').textContent,'2 / 2');
  closeLightbox();activeFilter='cantaria';openLightbox('c');navigateLightbox(1);
  assert.equal(activeLightboxProject.id,'c');assert.equal(lightboxIndex,0);
  closeLightbox();navigateLightbox(1);assert.equal(activeLightboxProject,null);
})().catch(e => {console.error(e);process.exitCode=1;});
""")

    def test_photo_limits_compression_removal_errors_and_reference(self):
        intake = self.js.split('  const photoIntakes =', 1)[1].split('     6. Header', 1)[0]
        intake = 'const photoIntakes =' + intake.rsplit('  /*', 1)[0]
        self.run_js(ADAPTER + r"""
let refs=0;
function generateDossierRef(){return `SOL-2026-${++refs}AAA`;}
function getWhatsAppUrl(phone,text){return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;}
const created=[], revoked=[];
const URL={createObjectURL: object => {const u=`blob:${created.length}`;created.push(u);return u;},revokeObjectURL:u=>revoked.push(u)};
let decodeFails=false, encodingFails=false;
class Image {naturalWidth=3200;naturalHeight=1800;async decode(){if(decodeFails) throw Error('decode');}}
const canvasSizes=[];
let qualities=[];
document.createElement = tag => {
  if(tag !== 'canvas') return new Element();
  const canvas = {getContext:()=>({fillRect(){},drawImage(){canvasSizes.push([canvas.width,canvas.height]);}}),
    toBlob(callback,type,quality){qualities.push(quality);callback(encodingFails?null:{size:quality>.7?400000:200000,type});}};
  return canvas;
};
const forms=[];
for(let i=0;i<2;i++){
  const root=new Element(), form=new Element(), fields={};
  root.parts={};root.querySelector=s=>root.parts[s] ||= new Element();
  root.closest=()=>form;form.elements={namedItem:n=>fields[n] ||= {value:'Porto',selectedOptions:[{textContent:'Cantaria'}]}};
  roots.push(root);forms.push(form);
}
""" + intake + r"""
(async()=>{
 const root=roots[0],input=root.querySelector('input[type="file"]'),drop=root.querySelector('.photo-dropzone');
 const thumbnails=root.querySelector('.photo-thumbnails'),status=root.querySelector('.photo-status');
 const state=photoIntakes.get(forms[0]);
 const file={type:'image/jpeg',size:5000000};
 input.files=[file];await input.emit('change');
 assert.equal(state.photos.length,1);assert.equal(thumbnails.children.length,1);
 assert.deepEqual(canvasSizes[0],[1600,900]);assert.deepEqual(qualities,[.82,.65]);
 assert.equal(state.photos[0].blob.size,200000);assert.ok(revoked.includes(created[0]));
 let prevented=false;
 await drop.emit('drop',{dataTransfer:{files:[file,file,file]},preventDefault(){prevented=true;}});
 assert.ok(prevented);assert.equal(state.photos.length,4);
 const urls=state.photos.map(p=>p.url);
 input.files=[file];await input.emit('change');assert.equal(state.photos.length,4);
 assert.equal(status.textContent,'inquiry.photos.limit');
 await thumbnails.children[0].children[2].emit('click');assert.equal(state.photos.length,3);assert.ok(revoked.includes(urls[0]));
 for(const bad of [{type:'image/gif',size:10},{type:'image/png',size:13*1024*1024}]){
  input.files=[bad];await input.emit('change');assert.equal(state.photos.length,3);assert.equal(status.textContent,'inquiry.photos.error');
 }
 decodeFails=true;input.files=[file];await input.emit('change');decodeFails=false;
 assert.equal(state.photos.length,3);assert.equal(input.disabled,false);
 encodingFails=true;input.files=[file];await input.emit('change');encodingFails=false;
 assert.equal(state.photos.length,3);assert.equal(root.attributes['aria-busy'],'false');
 state.setRef('SOL-2026-ABCD');
 assert.ok(thumbnails.children[0].children[1].download.startsWith('SOL-2026-ABCD'));
 const href=decodeURIComponent(root.querySelector('.photo-whatsapp').href);
 assert.ok(href.includes('SOL-2026-ABCD'));assert.ok(href.includes('Porto'));
 assert.equal(photoIntakes.get(forms[1]).photos.length,0);
 await forms[0].emit('reset');assert.equal(state.photos.length,0);
 assert.notEqual(state.ref,'SOL-2026-ABCD');
 urls.slice(1).forEach(url=>assert.ok(revoked.includes(url)));
})().catch(e=>{console.error(e);process.exitCode=1;});
""")

    def test_markup_and_check_gate(self):
        ids = TagCollector(self.html).ids
        for element in ['lightbox-prev','lightbox-next','lightbox-position','lightbox-technical','technical-detail','inpage-photos','modal-photos']:
            self.assertIn(element,ids)
        self.assertIn('scripts/test_lightbox_navigation.py',(ROOT / 'Makefile').read_text())
        self.assertIn('cotas indicativas',self.html)
        self.assertIn('envio integrado no formulário',self.html)


if __name__ == '__main__':
    unittest.main()
