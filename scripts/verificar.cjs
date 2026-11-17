'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const node = process.execPath;
const applicationFiles = fs.readdirSync(path.join(root, 'jogo/aplicacao')).filter(file => file.endsWith('.js')).map(file => `jogo/aplicacao/${file}`);
const suites = {
  rapido: [
    ['Sincronização do HTML', 'scripts/sincronizar-motor.cjs', '--verificar'],
    ['Rastreabilidade', 'scripts/validar-rastreabilidade.cjs'],
    ['Formatação da aplicação', 'node_modules/prettier/bin/prettier.cjs', '--check', ...applicationFiles],
    ['Documentação', 'testes/validar-documentacao.cjs'],
    ['Motor', 'testes/validar-motor-base.cjs'],
  ],
  combate: [['Combate e fluxo', 'testes/validar-fluxo-dinamico.cjs']],
  elfos: [['Elfos', 'testes/validar-elfos.cjs']],
  mapa: [['Mapa e documentação', 'testes/validar-documentacao.cjs'], ['Conceito de mesa', 'testes/validar-mesa-conceito.cjs']],
  restante: [
    ['Liderança', 'testes/validar-lideranca.cjs'],
    ['Fluxo e combate', 'testes/validar-fluxo-dinamico.cjs'],
    ['Partida', 'testes/validar-partida.cjs'],
    ['Elfos', 'testes/validar-elfos.cjs'],
    ['Necromante', 'testes/validar-necromante.cjs'],
    ['Habilidades', 'testes/validar-novas-habilidades.cjs'],
    ['Publicação', 'testes/validar-publicacao.cjs'],
    ['Conceito de mesa', 'testes/validar-mesa-conceito.cjs'],
    ['Navegador', 'node_modules/@playwright/test/cli.js', 'test'],
  ],
};
const selection = process.argv[2];
if (!['rapido', 'completo', 'combate', 'elfos', 'mapa'].includes(selection)) {
  console.error('Uso: node scripts/verificar.cjs rapido|completo|combate|elfos|mapa');
  process.exit(2);
}
const checks = selection === 'completo' ? [...suites.rapido, ...suites.restante] : suites[selection];
const start = performance.now();
for (const [name, file, ...args] of checks) {
  const before = performance.now();
  console.log(`\n▶ ${name}`);
  const result = spawnSync(node, [path.join(root, file), ...args], { cwd: root, stdio: 'inherit', env: process.env });
  console.log(`${name}: ${((performance.now() - before) / 1000).toFixed(2)} s`);
  if (result.error || result.status !== 0) {
    if (result.error) console.error(result.error.message);
    console.error(`Verificação interrompida em ${name}.`);
    process.exit(result.status || 1);
  }
}
console.log(`\nVerificação ${selection} concluída em ${((performance.now() - start) / 1000).toFixed(2)} s.`);
