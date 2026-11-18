'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const experimental = process.argv.includes('--baralhos-revisados');
const htmlPath = path.join(root, experimental ? 'mapa-baralhos-revisados.html' : 'mapa-fluxo-dinamico.html');
const templatePath = path.join(root, 'mapa-fluxo-dinamico.html');
const source = fs.readFileSync(path.join(root, 'jogo/motor/base.js'), 'utf8').trimEnd();
const html = fs.readFileSync(templatePath, 'utf8');
const pattern = /<!-- INÍCIO MOTOR BASE -->[\s\S]*?<!-- FIM MOTOR BASE -->/;
const block = `<!-- INÍCIO MOTOR BASE -->\n<script>\n${source}\n</script>\n<!-- FIM MOTOR BASE -->`;
if (!pattern.test(html)) throw Error('Marcadores do motor ausentes no HTML.');
let next = html.replace(pattern, () => block);
for (const [name, file] of [['MAPA','mapa.js'],['FLUXO','fluxo.js'],['COMBATE','combate.js'],['ACOES','acoes.js']]) {
  let source = fs.readFileSync(path.join(root, 'jogo/aplicacao', file), 'utf8').trimEnd();
  if (name === 'ACOES') {
    const placeholder = '// @aplicacao PONTUACAO';
    if (!source.includes(placeholder)) throw Error('Marcador de pontuação ausente na aplicação.');
    const scoring = fs.readFileSync(path.join(root, 'jogo/aplicacao/pontuacao.js'), 'utf8').trimEnd();
    source = source.replace(placeholder, () => `// INÍCIO PONTUAÇÃO\n${scoring}\n// FIM PONTUAÇÃO`);
  }
  for (const [dataName, dataFile] of [['MAPA','mapa.js'],['CARTAS','cartas.js'],['IMPERIO','imperio.js']]) {
    const placeholder = `// @dados ${dataName}`;
    if (source.includes(placeholder)) {
      const data = fs.readFileSync(path.join(root, 'jogo/dados', experimental && dataName === 'CARTAS' ? 'cartas-revisadas.js' : dataFile), 'utf8').trimEnd();
      source = source.replace(placeholder, () => `// INÍCIO DADOS ${dataName}\n${data}\n// FIM DADOS ${dataName}`);
    }
  }
  if (source.includes('// @artes')) {
    const art = fs.readFileSync(path.join(root, 'jogo/apresentacao/artes.js'), 'utf8').trimEnd();
    source = source.replace('// @artes', () => `// INÍCIO ARTES\n${art}\n// FIM ARTES`);
  }
  const appPattern = new RegExp(`<!-- INÍCIO APLICAÇÃO ${name} -->[\\s\\S]*?<!-- FIM APLICAÇÃO ${name} -->`);
  if (!appPattern.test(next)) throw Error(`Marcadores de aplicação ${name} ausentes no HTML.`);
  next = next.replace(appPattern, () => `<!-- INÍCIO APLICAÇÃO ${name} -->\n<script>\n${source}\n</script>\n<!-- FIM APLICAÇÃO ${name} -->`);
}
for (const [name, file] of [['MAPA', 'mapa.js'], ['CARTAS', 'cartas.js'], ['IMPERIO', 'imperio.js']]) {
  const data = fs.readFileSync(path.join(root, 'jogo/dados', experimental && name === 'CARTAS' ? 'cartas-revisadas.js' : file), 'utf8').trimEnd();
  const dataPattern = new RegExp(`// INÍCIO DADOS ${name}\\n[\\s\\S]*?// FIM DADOS ${name}`);
  if (!dataPattern.test(next)) throw Error(`Marcadores de dados ${name} ausentes no HTML.`);
  next = next.replace(dataPattern, () => `// INÍCIO DADOS ${name}\n${data}\n// FIM DADOS ${name}`);
}
const art = fs.readFileSync(path.join(root, 'jogo/apresentacao/artes.js'), 'utf8').trimEnd();
const artPattern = /\/\/ INÍCIO ARTES\n[\s\S]*?\/\/ FIM ARTES/;
if (!artPattern.test(next)) throw Error('Marcadores de artes ausentes no HTML.');
next = next.replace(artPattern, () => `// INÍCIO ARTES\n${art}\n// FIM ARTES`);
const styles = fs.readFileSync(path.join(root, 'jogo/apresentacao/mesa.css'), 'utf8').trimEnd();
const stylePattern = /\/\* INÍCIO ESTILO MESA \*\/[\s\S]*?\/\* FIM ESTILO MESA \*\//;
if (!stylePattern.test(next)) throw Error('Marcadores de estilo ausentes no HTML.');
next = next.replace(stylePattern, () => `/* INÍCIO ESTILO MESA */\n${styles}\n/* FIM ESTILO MESA */`);
if (experimental) {
  next = next.replace('<title>Conflict Island — protótipo principal</title>', '<title>Conflict Island — baralhos revisados (experimento)</title>');
  next = next.replace('<small>A ILHA DE CÂLEPOO</small>', '<small>BARALHOS REVISADOS · EXPERIMENTO</small>');
}
if (process.argv.includes('--verificar')) {
  const actual = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
  if (next !== actual) throw Error('Motor, dados ou apresentação incorporados desatualizados. Execute node scripts/sincronizar-motor.cjs' + (experimental ? ' --baralhos-revisados' : '') + '.');
  console.log('Motor, dados e apresentação incorporados estão sincronizados.');
} else fs.writeFileSync(htmlPath, next);
