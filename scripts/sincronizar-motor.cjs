'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'mapa-fluxo-dinamico.html');
const source = fs.readFileSync(path.join(root, 'jogo/motor/base.js'), 'utf8').trimEnd();
const html = fs.readFileSync(htmlPath, 'utf8');
const pattern = /<!-- INÍCIO MOTOR BASE -->[\s\S]*?<!-- FIM MOTOR BASE -->/;
const block = `<!-- INÍCIO MOTOR BASE -->\n<script>\n${source}\n</script>\n<!-- FIM MOTOR BASE -->`;
if (!pattern.test(html)) throw Error('Marcadores do motor ausentes no HTML.');
const next = html.replace(pattern, () => block);
if (process.argv.includes('--verificar')) {
  if (next !== html) throw Error('Motor incorporado desatualizado. Execute node scripts/sincronizar-motor.cjs.');
  console.log('Motor incorporado está sincronizado.');
} else fs.writeFileSync(htmlPath, next);
