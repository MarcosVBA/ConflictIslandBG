'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const entries = JSON.parse(fs.readFileSync(path.join(root, 'prototipo/rastreabilidade.json'), 'utf8'));
const validStates = new Set(['definida', 'proposta', 'pendente', 'adiada', 'em-teste', 'mista']);
const seen = new Set();
for (const entry of entries) {
  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(entry.id) || seen.has(entry.id)) throw Error(`Identificador inválido ou duplicado: ${entry.id}`);
  seen.add(entry.id);
  if (!entry.assunto || !validStates.has(entry.estado)) throw Error(`Assunto ou estado inválido: ${entry.id}`);
  for (const field of ['fontes', 'implementacao', 'testes']) {
    if (!Array.isArray(entry[field]) || (field === 'fontes' && !entry[field].length)) throw Error(`Campo ${field} inválido: ${entry.id}`);
    for (const file of entry[field]) {
      if (typeof file !== 'string' || path.isAbsolute(file) || file.split('/').includes('..') || !fs.existsSync(path.join(root, file))) throw Error(`Referência inexistente ou inválida: ${entry.id} ${file}`);
    }
  }
  if (!['adiada', 'pendente'].includes(entry.estado) && (!entry.implementacao.length || !entry.testes.length)) throw Error(`Item em uso sem implementação ou teste: ${entry.id}`);
}
const link = file => `[${file}](../${file})`;
const rows = entries.map(e => `| ${e.id} | ${e.assunto} | ${e.estado} | ${e.fontes.map(link).join('<br>')} | ${e.implementacao.map(link).join('<br>') || '—'} | ${e.testes.map(link).join('<br>') || '—'} |`).join('\n');
const doc = '# Matriz de rastreabilidade\n\nGerado a partir de [rastreabilidade.json](rastreabilidade.json) por `node scripts/validar-rastreabilidade.cjs --atualizar`. O estado se refere à decisão de design, não garante implementação completa. “Mista” reúne decisões definidas e hipóteses ou valores em teste; consulte as fontes. A lista é um índice das áreas principais, não um inventário de cada carta ou garantia de cobertura.\n\n| ID | Assunto | Estado | Fontes | Implementação | Testes relacionados |\n| --- | --- | --- | --- | --- | --- |\n' + rows + '\n\nA verificação confirma estrutura, estados e existência dos arquivos; não interpreta regras nem prova que os testes cubram todo o comportamento descrito.\n';
const target = path.join(root, 'prototipo/rastreabilidade.md');
if (process.argv.includes('--atualizar')) fs.writeFileSync(target, doc);
else if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== doc) throw Error('Matriz desatualizada. Execute node scripts/validar-rastreabilidade.cjs --atualizar.');
console.log(`Rastreabilidade: ${entries.length} áreas e referências verificadas.`);
