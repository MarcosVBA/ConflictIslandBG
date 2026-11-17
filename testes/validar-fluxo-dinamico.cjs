'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
const scenario = String.raw`
check("edges.length===18&&!neighbors('R3').includes('R7')&&!neighbors('R7').includes('R3')&&!neighbors('R9').includes('R11')&&!neighbors('R11').includes('R9')&&!neighbors('R7').includes('R9')&&!neighbors('R9').includes('R7')&&!neighbors('R1').includes('R9')&&!neighbors('R9').includes('R1')&&!neighbors('R6').includes('R8')&&!neighbors('R8').includes('R6')&&neighbors('R7').includes('R11')&&neighbors('R11').includes('R7')&&neighbors('R3').includes('R4')&&neighbors('R4').includes('R7')");
check("byId('R7').name==='Pico Desolado'&&!byId('R7').coast&&byId('R7').resource==='Sem recurso'&&byId('R9').name==='Baixio dos Garimpeiros'&&byId('R9').terrain==='planicie'&&byId('R11').name==='Costa do Ouro Perdido'&&['R9','R11'].every(id=>byId(id).coast&&byId(id).resource==='Ouro')");
assert(element('diagnostics').innerHTML.includes('Verificações aprovadas'),'Diagnóstico deve refletir a nova distribuição de recursos.');
set('orderChoice','imperio');set('handSize',5);click('startRound');
check("flow.phase==='alistamento'&&flow.decks.imperio.hand.length===5&&state.R1.units.imperio===2");
set('imperialRecruit','R1');click('confirmImperialRecruit');
check("flow.phase==='leilão'&&state.R1.units.imperio===3&&game.imperialRecruitRound===1");
for(let i=0;i<4;i++)click('passBid');
check("flow.phase==='resolução'&&activeFaction()==='imperio'&&flow.markers.length===8&&flow.markers.every(m=>!m.used&&m.region===null)");
assert(!element('flow').innerHTML.includes('id="addMarker"'),'Alocação antecipada não deve estar disponível.');
run("flow.decks.imperio.hand=[{name:'Alistamento',text:'Recrutar',leadership:0}];renderFlow()");
set('actionMarker',0);set('actionRegion','R1');
regions.find(r=>r.attributes['data-region']==='R2').onclick();
check("selected==='R2'&&flow.markers.every(m=>m.region===null)");
assert(element('actionRegion').value==='R2','Selecionar uma região no mapa deve atualizar a ação.');
set('actionRegion','R10');element('actionRegion').onchange();cards[0].onclick();click('executeAction');
check("flow.markers[0].region==='R10'&&!flow.markers[0].used&&state.R1.units.imperio===3&&resources.imperio.ouro===1");
set('actionRegion','R1');element('actionRegion').onchange();check("flow.markers[0].region===null");cards[0].onclick();
check("flow.markers[0].region==='R1'&&!flow.markers[0].used");
click('executeAction');check("state.R1.units.imperio===5&&flow.markers[0].used&&activeFaction()==='necromante'");
check("flow.markers.filter(m=>!m.used).every(m=>m.region===null)");
run("flow.decks.necromante.hand=[{name:'Trabalhadores Zumbificado',text:'Coletar',leadership:0}];renderFlow()");
set('actionMarker',2);set('actionRegion','R4');cards[0].onclick();click('executeAction');
check("resources.necromante.madeira===2&&flow.markers[2].used&&activeFaction()==='piratas'");
set('actionMarker',4);click('passAction');check("flow.markers[4].used&&activeFaction()==='elfos'");
run("flow.decks.elfos.hand=[{name:'Conhecimentos da Floresta',text:'Defesa',leadership:0}];renderFlow()");
set('actionMarker',6);set('actionRegion','R10');cards[0].onclick();check("flow.markers[6].region===null&&!flow.markers[6].used");click('discardAction');check("flow.markers[6].used&&flow.decks.elfos.discard.some(c=>c.name==='Conhecimentos da Floresta')");
console.log('Compra, alistamento, leilão e ações com marcadores na reserva OK');
// R9 é destino costeiro e R7 não é uma origem costeira; a coleta em R9 gera Ouro.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['imperio','necromante','piratas','elfos'];flow.turn=2;flow.markers=factionIds.flatMap(f=>[{f,region:null,used:false},{f,region:null,used:false}]);flow.decks.piratas.hand=[{name:'Invasão Costeira',text:'Navegar',leadership:2}];state.R7.units.piratas=1;state.R11.units.piratas=1;renderFlow()");
set('actionMarker',4);set('actionRegion','R9');cards[0].onclick();
assert(element('cardDetail').innerHTML.includes('move-R5')&&element('cardDetail').innerHTML.includes('move-R11')&&!element('cardDetail').innerHTML.includes('move-R7'),'Somente regiões costeiras devem ser origens da invasão.');
set('move-R5',1);set('move-R11',0);set('attackDefender','imperio');click('prepareAttack');
check("state.R9.units.piratas===1&&state.R7.units.piratas===1&&flow.markers[4].used");
set('extra',0);run("resources.imperio.ouro=0;state.R9.units.imperio=1;state.R11.units.imperio=1;flow.decks.imperio.hand=[{name:'Assegurar Recursos para o Rei'}];executeCard('imperio','Assegurar Recursos para o Rei','R9',0)");
check("resources.imperio.ouro===1");run("executeCard('imperio','Assegurar Recursos para o Rei','R11',0)");check("resources.imperio.ouro===2");
console.log('Costa e coleta de Ouro nas regiões alteradas OK');
// Uma construção sem tropas defensoras é alvo válido e não rola dado de defesa.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['imperio','necromante','piratas','elfos'];flow.turn=0;flow.markers=[{f:'imperio',region:'R6',used:false}];flow.decks.imperio.hand=[{name:'Tambores de Guerra',text:'Atacar'}];state.R6.units.imperio=1;state.R6.units.elfos=0;state.R6.bar=true;showAttackMovement('imperio',0,0)");
set('attackDefender','piratas');set('move-R2',0);set('move-R4',0);click('prepareAttack');check("battle&&battle.defender==='piratas'");
run("Math.random=()=>.99");set('battleReaction','none');click('rollBattle');check("battle.defenseDice.length===0&&battle.destroy===1");checkedBuildings=[{value:'0'}];click('applyBattle');checkedBuildings=[];check("!state.R6.bar&&flow.markers[0].used");
// Origem selecionada no momento da ação, inclusive para movimento élfico.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['imperio','necromante','piratas','elfos'];flow.turn=3;flow.markers=factionIds.flatMap(f=>[{f,region:null,used:false},{f,region:null,used:false}]);flow.decks.elfos.hand=[{name:'Furia da Ilha',text:'Mover',leadership:2}];renderFlow()");
set('actionMarker',6);set('actionRegion','R10');cards[0].onclick();set('destination','R11');set('quantity',1);set('attackDefender','imperio');click('elfFuryGo');
check("state.R10.units.elfos===1&&state.R11.units.elfos===1&&flow.markers[6].used");
console.log('Movimento a partir da região escolhida durante a ação OK');
// Ataque preparado pela interface, cancelado e depois resolvido com duas reações.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['imperio','necromante','piratas','elfos'];flow.markers=factionIds.flatMap(f=>[{f,region:null,used:false},{f,region:null,used:false}]);flow.decks.imperio.hand=[{name:'Marcha Imperial',text:'Atacar',leadership:1}];flow.decks.necromante.hand=[{name:'Praga Resistente'}];flow.decks.elfos.hand=[{name:'Canção de paz'}];renderFlow()");
set('actionMarker',0);set('actionRegion','R4');cards[0].onclick();set('attackDefender','necromante');set('move-R2',1);click('prepareAttack');
check("battle&&state.R4.units.imperio===1&&flow.markers[0].region==='R4'");
assert(!element('cardDetail').innerHTML.includes('id="cancelBattle"'),'Ataque confirmado não pode ser cancelado.');
set('battleReaction','defense');set('battleReactionMarker','2');element('peaceUse').checked=true;set('peaceMarker','6');click('rollBattle');click('applyBattle');
check("state.R4.units.imperio===1&&state.R4.units.necromante===1&&flow.markers[0].used&&flow.markers[2].used&&flow.markers[6].used");
console.log('Confirmação de ataque e reações com ações da reserva OK');
// Ação, defesa e Canção de paz utilizam marcadores sem região prévia.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['imperio','necromante','piratas','elfos'];flow.markers=[{f:'imperio',region:'R3',used:false},{f:'necromante',region:null,used:false},{f:'elfos',region:null,used:false}];flow.decks.imperio.hand=[{name:'Marcha Imperial'}];flow.decks.necromante.hand=[{name:'Praga Resistente'}];flow.decks.elfos.hand=[{name:'Canção de paz'}];state.R3.units.imperio=1;battle={f:'imperio',defender:'necromante',region:'R3',ci:0,mi:0,card:'Marcha Imperial',stage:'reaction'};renderBattle()");
set('battleReaction','defense');set('battleReactionMarker','1');element('peaceUse').checked=true;set('peaceMarker','2');click('rollBattle');
check("battle.result.swords===0&&battle.result.crosses===0");click('applyBattle');
check("flow.markers.every(m=>m.used)&&state.R3.units.imperio===1&&state.R3.units.necromante===2&&flow.decks.necromante.discard.length===1&&flow.decks.elfos.discard.length===1");
console.log('Defesa e Canção de paz consomem marcadores da reserva OK');
click('reset');
for(let round=1;round<=6;round++){
  set('orderChoice','imperio');set('handSize',5);click('startRound');
  if(run("flow.phase==='alistamento'")){set('imperialRecruit','R1');click('confirmImperialRecruit')}
  for(let i=0;i<4;i++)click('passBid');check("flow.phase==='resolução'&&flow.markers.length===8");
  while(run('activeFaction()!==null')){set('actionMarker',run('flow.markers.findIndex(m=>m.f===activeFaction()&&!m.used)'));click('passAction')}
  click('toScore');check("flow.phase==='pontuação'");click('nextRound');
}
check("flow.phase==='preparação'&&flow.round===7&&game.imperialRecruitRound===6");
run("game.score.elfos=19;addPoints('elfos',1,'teste')");check("game.endEventsReady&&!game.winner");
run("game.score.elfos=29;addPoints('elfos',1,'teste')");check("game.winner==='elfos'&&flow.phase==='fim'");
click('reset');check("flow.round===1&&flow.phase==='preparação'&&flow.markers.length===0&&state.R1.units.imperio===2");
assert(!/<(?:script|link|img)\b[^>]*(?:src|href)\s*=/i.test(html),'O protótipo deve funcionar em um único HTML.');
console.log('Seis rodadas e reinício OK');
`;
vm.runInNewContext(harness + scenario, { require, console, process, __dirname });
