'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
for (const [file, order] of [
  ['mapa-fluxo-dinamico.html', 'imperio,necromante,piratas,elfos'],
]) {
  const base = harness.replace("const html = read('mapa-fluxo-dinamico.html');", `const html = read('${file}');`);
  const scenario = `
const seatOrder = ${JSON.stringify(order)};
function clearBid(){for(let i=0;i<10;i++) element('bid-'+i).checked=false}
const values=JSON.parse(run('JSON.stringify(leadershipValues)'));
const selector=element('flow').innerHTML.split('<select id="orderChoice"')[1]?.split('</select>')[0];
assert(selector && (selector.match(/<option /g)||[]).length===seatOrder.split(',').length,'O seletor deve conter um jogador por opção.');
for(const first of seatOrder.split(',')){
  click('reset');set('orderChoice',first);set('handSize',5);click('startRound');if(run("flow.phase==='alistamento'")){set('imperialRecruit','R1');click('confirmImperialRecruit')}
  const seats=seatOrder.split(','),index=seats.indexOf(first),expected=seats.slice(index).concat(seats.slice(0,index)).join(',');
  assert(run("flow.order.join(',')")===expected,'Ordem anti-horária incorreta para '+first);
}
click('reset');
for(const f of seatOrder.split(',')){
  const defs=JSON.parse(run('JSON.stringify(cardDefs['+JSON.stringify(f)+'])'));
  assert(defs.every(([name])=>Number.isInteger(values[name]) && values[name]>=0 && values[name]<=3),'Liderança ausente ou inválida: '+f);

}
set('orderChoice','imperio');set('handSize',5);click('startRound');if(run("flow.phase==='alistamento'")){set('imperialRecruit','R1');click('confirmImperialRecruit')}
check("flow.phase==='leilão'&&factionIds.every(f=>flow.decks[f].hand.every(c=>c.leadership===leadershipValues[c.name]))");
run("flow.decks.imperio.hand=[{name:'Ordens da Coroa',leadership:1},{name:'Marcha Imperial',leadership:2}];flow.decks.necromante.hand=[{name:'Infestação',leadership:1},{name:'Magia das Trevas / Monumento à Morte',leadership:2}];renderFlow()");
clearBid();element('bid-0').checked=true;click('submitBid');check("flow.auction.leader==='imperio'&&flow.auction.high===1");
clearBid();element('bid-0').checked=true;element('bid-1').checked=true;click('submitBid');check("flow.auction.leader==='necromante'&&flow.auction.high===3");
click('passBid');click('passBid');click('passBid');check("flow.phase==='resolução'&&flow.order[0]==='necromante'&&flow.decks.necromante.discard.length===2&&flow.decks.imperio.hand.length===2");
console.log('Leilão, valores e lances verificados: ${file}');
`;
  vm.runInNewContext(base + scenario, { require, console, process, __dirname });
}
