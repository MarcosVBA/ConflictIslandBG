'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(path.join(out, 'icons'), { recursive: true });
for (const [source, target] of [
  ['mapa-conflito.html', 'index.html'],
  ['manifest.webmanifest', 'manifest.webmanifest'],
  ['service-worker.js', 'service-worker.js'],
  ['icons/icon-192.png', 'icons/icon-192.png'],
  ['icons/icon-512.png', 'icons/icon-512.png'],
  ['icons/icon-maskable-512.png', 'icons/icon-maskable-512.png'],
]) fs.copyFileSync(path.join(root, source), path.join(out, target));
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
