'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(path.join(out, 'icons'), { recursive: true });
for (const [source, target] of [
  ['manifest.webmanifest', 'manifest.webmanifest'],
  ['service-worker.js', 'service-worker.js'],
  ['icons/icon-192.png', 'icons/icon-192.png'],
  ['icons/icon-512.png', 'icons/icon-512.png'],
  ['icons/icon-maskable-512.png', 'icons/icon-maskable-512.png'],
]) fs.copyFileSync(path.join(root, source), path.join(out, target));
// Arte opcional conserva os caminhos relativos usados pelo HTML local.
const artDir = path.join(root, 'artes');
if (fs.existsSync(artDir)) fs.cpSync(artDir, path.join(out, 'artes'), { recursive: true });
// A fonte permanece um único HTML local; instalação é adicionada somente à cópia publicada.
const sourceHtml = fs.readFileSync(path.join(root, 'mapa-fluxo-dinamico.html'), 'utf8');
const manifestLinks = '<link rel="manifest" href="./manifest.webmanifest"><link rel="apple-touch-icon" href="./icons/icon-192.png">';
const installPanel = '<details><summary>Instalar no celular</summary><p>Android: use a instalação ou o menu do navegador. iPhone: no Safari, use Compartilhar e Adicionar à Tela de Início.</p><button type="button" id="installApp" hidden>Instalar aplicativo</button></details>';
const installScript = `<script>
if (typeof navigator !== 'undefined' && typeof location !== 'undefined' && location.protocol !== 'file:') {
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  const button = document.getElementById('installApp');
  let pending = null;
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); pending = event; button.hidden = false; });
  button.addEventListener('click', async () => { if (!pending) return; const prompt = pending; pending = null; button.hidden = true; await prompt.prompt(); });
  window.addEventListener('appinstalled', () => { pending = null; button.hidden = true; });
}
</script>`;
if (!sourceHtml.includes('</head>') || !sourceHtml.includes('</body>') || !sourceHtml.includes('<h1>Conflict Island</h1>')) throw new Error('Estrutura do protótipo principal incompatível com a publicação.');
const publishedHtml = sourceHtml.replace('</head>', manifestLinks + '</head>').replace('<h1>Conflict Island</h1>', '<h1>Conflict Island</h1>' + installPanel).replace('</body>', installScript + '</body>');
fs.writeFileSync(path.join(out, 'index.html'), publishedHtml);
// Cópia autossuficiente para um repositório público que contenha apenas o jogo.
const workflowDir = path.join(out, '.github', 'workflows');
fs.mkdirSync(workflowDir, { recursive: true });
fs.writeFileSync(path.join(workflowDir, 'pages.yml'), `name: Publicar jogo no GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
`);
console.log('Site estático preparado em dist/.');
