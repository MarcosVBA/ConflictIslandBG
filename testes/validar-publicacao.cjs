'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const manifest = JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.start_url, './');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'standalone');
for (const icon of manifest.icons) {
  const buffer = read(icon.src);
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const size = Number(icon.sizes.split('x')[0]);
  assert.equal(buffer.readUInt32BE(16), size);
  assert.equal(buffer.readUInt32BE(20), size);
}
assert(manifest.icons.some(icon => icon.purpose === 'maskable'));
const html = read('mapa-conflito.html').toString();
assert(html.includes('href="./manifest.webmanifest"'));
assert(html.includes("register('./service-worker.js')"));
const handlers = {};
let cachedAssets;
vm.runInNewContext(read('service-worker.js').toString(), {
  self: { addEventListener: (name, handler) => { handlers[name] = handler; }, skipWaiting: () => Promise.resolve() },
  caches: { open: async () => ({ addAll: async assets => { cachedAssets = Array.from(assets); } }) },
  URL,
});
for (const name of ['install', 'activate', 'fetch']) assert.equal(typeof handlers[name], 'function');
const installed = [];
handlers.install({ waitUntil(promise) { installed.push(promise); } });
Promise.all(installed).then(() => {
  for (const asset of ['./index.html', './manifest.webmanifest', ...manifest.icons.map(icon => icon.src)]) assert(cachedAssets.includes(asset));
  console.log('OK: manifesto, ícones e instalação do cache offline.');
}).catch(error => { console.error(error); process.exitCode = 1; });
