'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
for (const file of ['mapa-fluxo-dinamico.html']) {
  const base = harness.replace("const html = read('mapa-fluxo-dinamico.html');", `const html = read('${file}');`);
  const scenario = `
const text = read('faccoes/necromante.md');
check("cardDefs.necromante.reduce((n,c)=>n+c[1],0)===12&&newFlow().decks.necromante.draw.length===12");
assert(text.includes('| Despertar para a Morte | 1 Madeira |'),'A magia deve permanecer documentada.');
set('spell','Despertar para a Morte');set('other','imperio');
run("state=initial();resources=initialResources();game=newGame()");
check("(()=>{try{executeCard('necromante','Magia das Trevas','R1',0);return false}catch(e){return resources.necromante.madeira===1&&state.R1.units.imperio===2}})()");
run("executeCard('necromante','Magia das Trevas','R2',0)");
check("resources.necromante.madeira===0&&state.R2.units.imperio===0&&state.R2.units.necromante===1");
// Remanejamento permite movimentos repetidos entre regiões devastadas adjacentes.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['necromante',...factionIds.filter(f=>f!=='necromante')];flow.turn=0;flow.markers=[{f:'necromante',region:'R3',used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos',text:''}];showRemanejamento('necromante',0,0)");
set('remOrigin','R3');element('remOrigin').onchange();set('remDestination','R4');set('remQuantity',1);click('remMove');check("state.R3.units.necromante===2&&state.R4.units.necromante===1");
set('remOrigin','R4');element('remOrigin').onchange();set('remDestination','R3');set('remQuantity',2);click('remMove');check("state.R3.units.necromante===2&&state.R4.units.necromante===1");click('remFinish');check("state.R3.units.necromante===3&&state.R4.units.necromante===0&&flow.markers[0].used&&flow.decks.necromante.hand.length===5");
// Região que estava devastada continua elegível mesmo após esvaziar durante o efeito.
run("state=initial();state.R6.units.elfos=0;state.R6.units.necromante=1;game=newGame();flow=newFlow();flow.phase='resolução';flow.markers=[{f:'necromante',region:'R4',used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos',text:''}];showRemanejamento('necromante',0,0)");
set('remOrigin','R6');element('remOrigin').onchange();set('remDestination','R4');set('remQuantity',1);click('remMove');check("state.R6.units.necromante===1&&devastated(state.R6)");
set('remOrigin','R4');element('remOrigin').onchange();set('remDestination','R6');set('remQuantity',1);click('remMove');check("state.R6.units.necromante===1");click('remCancel');check("state.R6.units.necromante===1&&!flow.markers[0].used");
// Não existe teto artificial de mil tropas no movimento quando há peças no estado.
run("state=initial();state.R4.units.necromante=1001;game=newGame();flow=newFlow();flow.phase='resolução';flow.markers=[{f:'necromante',region:'R4',used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos',text:''}];showRemanejamento('necromante',0,0)");
set('remOrigin','R4');element('remOrigin').onchange();set('remDestination','R3');set('remQuantity',1001);click('remMove');check("state.R4.units.necromante===1001&&state.R3.units.necromante===2");click('remFinish');check("state.R4.units.necromante===0&&state.R3.units.necromante===1003");
// Uma alteração externa durante a prévia não é sobrescrita ao concluir.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['necromante','piratas','elfos','imperio'];flow.markers=[{f:'necromante',region:'R4',used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos',text:''}];showRemanejamento('necromante',0,0)");set('remOrigin','R3');element('remOrigin').onchange();set('remDestination','R4');set('remQuantity',1);click('remMove');run("state.R3.units.necromante=4");click('remFinish');check("state.R3.units.necromante===4&&!flow.markers[0].used");assert(element('actionError').textContent.includes('mapa mudou'),'Mudança externa deve impedir a confirmação.');click('remCancel');check("state.R3.units.necromante===4");
console.log('Baralho, magia e custo do Monumento verificados: ${file}');
`;
  vm.runInNewContext(base + scenario, { require, console, process, __dirname });
}
