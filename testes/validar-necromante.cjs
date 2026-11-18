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
// Um zumbi pode entrar em região não devastada com inimigos sem combate.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['necromante','piratas','elfos','imperio'];flow.markers=[{f:'necromante',region:null,used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos'},{name:'Infestação'}];showRemanejamento('necromante',0,0)");
set('remOrigin','R4');element('remOrigin').onchange();set('remDestination','R6');click('remFinish');check("state.R4.units.necromante===0&&state.R6.units.necromante===1&&state.R6.units.elfos===2&&!battle&&flow.markers[0].used&&flow.decks.necromante.hand.length===1&&flow.decks.necromante.hand[0].name==='Infestação'");
// Destinos não adjacentes não são aceitos e cancelamento preserva ação.
run("state=initial();game=newGame();flow=newFlow();flow.phase='resolução';flow.markers=[{f:'necromante',region:null,used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos'}];showRemanejamento('necromante',0,0)");set('remOrigin','R3');element('remOrigin').onchange();set('remDestination','R10');click('remFinish');check("!flow.markers[0].used&&state.R3.units.necromante===2");click('remCancel');
// Sair da Torre ao perder seu domínio aciona a recuperação.
run("state=initial();state.R3.units.necromante=1;state.R3.units.imperio=1;game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['necromante','piratas','elfos','imperio'];flow.markers=[{f:'necromante',region:null,used:false}];flow.decks.necromante.hand=[{name:'Remanejando Mortos'}];showRemanejamento('necromante',0,0)");set('remOrigin','R3');element('remOrigin').onchange();set('remDestination','R4');click('remFinish');check("state.R3.units.necromante===2&&state.R4.units.necromante===0&&flow.markers[0].used");
console.log('Baralho, magia e custo do Monumento verificados: ${file}');
`;
  vm.runInNewContext(base + scenario, { require, console, process, __dirname });
}
