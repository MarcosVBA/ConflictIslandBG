'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
for (const [file, order] of [
  ['mapa-conflito.html', 'imperio,necromante,piratas'],
  ['mapa-quatro-faccoes.html', 'imperio,necromante,piratas,elfos'],
]) {
  const base = harness.replace("const html = read('mapa-conflito.html');", `const html = read('${file}');`);
  const scenario = `
const seatOrder = ${JSON.stringify(order)};
function clearBid(){for(let i=0;i<10;i++) element('bid-'+i).checked=false}
const values=JSON.parse(run('JSON.stringify(leadershipValues)'));
const selector=element('flow').innerHTML.split('<select id="orderChoice"')[1]?.split('</select>')[0];
assert(selector && (selector.match(/<option /g)||[]).length===seatOrder.split(',').length,'O seletor deve conter um jogador por opção.');
for(const first of seatOrder.split(',')){
  click('reset');set('orderChoice',first);set('handSize',5);click('startRound');
  const seats=seatOrder.split(','),index=seats.indexOf(first),expected=seats.slice(index).concat(seats.slice(0,index)).join(',');
  assert(run("flow.order.join(',')")===expected,'Ordem anti-horária incorreta para '+first);
}
click('reset');
for(const f of seatOrder.split(',')){
  const defs=JSON.parse(run('JSON.stringify(cardDefs['+JSON.stringify(f)+'])'));
  assert(defs.every(([name])=>Number.isInteger(values[name]) && values[name]>=0 && values[name]<=3),'Liderança ausente ou inválida: '+f);
  const section=read('faccoes/'+f+'.md').split('## Liderança por carta')[1]?.split('\\n## ')[0];
  assert(section,'Tabela de liderança ausente: '+f);
  const rows=[...section.matchAll(/^\\|\\s*([^|]+?)\\s*\\|\\s*(\\d+)\\s*\\|/gm)].map(x=>[x[1].trim(),Number(x[2])]);
  assert(JSON.stringify(rows)===JSON.stringify(defs.map(([name])=>[name,values[name]])),'Valores documentados divergentes: '+f);
}
set('orderChoice','imperio');set('handSize',5);click('startRound');check("flow.phase==='leilão'");
check("factionIds.every(f=>flow.decks[f].hand.every(c=>c.leadership===leadershipValues[c.name]))");
run("flow.decks.imperio.hand=[{name:'Marcha Imperial',leadership:leadershipValues['Marcha Imperial']},{name:'Tambores de Guerra',leadership:leadershipValues['Tambores de Guerra']}];flow.decks.necromante.hand=[{name:'Despertar para a Morte',leadership:leadershipValues['Despertar para a Morte']},{name:'Ataque Zumbi',leadership:leadershipValues['Ataque Zumbi']}];renderFlow()");
clearBid();element('bid-0').checked=true;click('submitBid');check("flow.auction.leader==='imperio'&&flow.auction.high===1");
clearBid();element('bid-1').checked=true;click('submitBid');check("flow.auction.leader==='imperio'&&flow.auction.high===1&&flow.order[flow.auction.turn]==='necromante'");
clearBid();element('bid-0').checked=true;click('submitBid');check("flow.auction.leader==='necromante'&&flow.auction.high===2");
click('passBid');
if(seatOrder.includes('elfos'))click('passBid');
check("flow.order[flow.auction.turn]==='imperio'");clearBid();element('bid-1').checked=true;click('submitBid');
check("flow.auction.leader==='imperio'&&flow.auction.high===3&&flow.auction.offers.imperio.length===2");
click('passBid');check("flow.phase==='alocação'&&flow.order[0]==='imperio'&&flow.decks.imperio.hand.length===0&&flow.decks.imperio.discard.length===2&&flow.decks.necromante.hand.length===2");
click('reset');set('orderChoice','imperio');set('handSize',5);click('startRound');
run("flow.decks.imperio.hand=[{name:'Marcha Imperial',leadership:leadershipValues['Marcha Imperial']}];flow.decks.necromante.hand=[{name:'Despertar para a Morte',leadership:leadershipValues['Despertar para a Morte']}];renderFlow()");
clearBid();element('bid-0').checked=true;click('submitBid');clearBid();element('bid-0').checked=true;click('submitBid');click('passBid');if(seatOrder.includes('elfos'))click('passBid');click('passBid');
check("flow.phase==='alocação'&&flow.order[0]==='necromante'&&flow.allocationFaction==='piratas'&&flow.decks.necromante.discard.length===1&&flow.decks.imperio.hand.length===1");
assert(run("flow.order.join(',')")===seatOrder.split(',').slice(1).concat('imperio').join(','),'Ordem da mesa alterada após a vitória.');
run("flow.round=2;flow.phase='preparação';renderFlow()");
set('handSize',5);click('startRound');
check("flow.phase==='leilão'&&flow.order[flow.auction.turn]==='necromante'");
for(let i=0;i<seatOrder.split(',').length;i++)click('passBid');
check("flow.phase==='alocação'&&flow.order[0]==='necromante'");
console.log('Leilão, valores e lances verificados: ${file}');
`;
  vm.runInNewContext(base + scenario, { require, console, process, __dirname });
}
