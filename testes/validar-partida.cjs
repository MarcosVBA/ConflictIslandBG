'use strict';

// Percorre uma rodada completa com as quatro facções e o fluxo real da mesa.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
const scenario = String.raw`
set('orderChoice','imperio');set('handSize',5);click('startRound');
set('imperialRecruit','R1');click('confirmImperialRecruit');
for(let i=0;i<4;i++)click('passBid');
run("flow.decks.imperio.hand=[{name:'Assegurar Recursos para o Rei'}];flow.decks.necromante.hand=[{name:'Extratores da Torre'}];flow.decks.piratas.hand=[{name:'Taverna Pirata / Pirata Aprendiz'}];flow.decks.elfos.hand=[{name:'Frutos da Mata / Filhos da Floresta'}];renderFlow()");
function play(region, index){run("flow.markers.find(m=>m.f===activeFaction()&&!m.used).region="+JSON.stringify(region)+";preparedMode={f:activeFaction(),ci:0,mi:flow.markers.findIndex(m=>m.f===activeFaction()&&!m.used),mode:experimentalModes[flow.decks[activeFaction()].hand[0].name]["+index+"]};showPlayableAction(preparedMode.f,0,preparedMode.mi,preparedMode.mode)");click('executeAction')}
set('extra',0);play('R1',0);check("resources.imperio.ouro===2&&activeFaction()==='necromante'");
play('R4',1);check("resources.necromante.madeira===2&&activeFaction()==='piratas'");
play('R5',1);check("state.R5.units.piratas===2&&activeFaction()==='elfos'");
play('R10',0);check("resources.elfos.madeira===2&&activeFaction()==='imperio'");
for(let i=0;i<4;i++){set('actionMarker',run('flow.markers.findIndex(m=>m.f===activeFaction()&&!m.used)'));click('passAction')}
check("activeFaction()===null");click('toScore');
check("flow.phase==='pontuação'&&game.score.elfos===1&&game.score.necromante===1&&game.scored===1");
click('nextRound');check("flow.phase==='preparação'&&flow.round===2&&flow.order[0]==='imperio'");
// Uma partida sem ações exercita as transições reais até a vitória por pontuação.
click('reset');
let rounds=0;
while(!run('Boolean(game.winner)') && rounds<40){
  rounds++;
  set('orderChoice','imperio');set('handSize',5);click('startRound');
  if(run("flow.phase==='alistamento'")){set('imperialRecruit','R1');click('confirmImperialRecruit')}
  for(let i=0;i<4;i++)click('passBid');
  while(run('activeFaction()!==null')){set('actionMarker',run('flow.markers.findIndex(m=>m.f===activeFaction()&&!m.used)'));click('passAction')}
  click('toScore');
  if(!run('Boolean(game.winner)'))click('nextRound');
}
check("game.winner!==null&&game.score[game.winner]>=30&&flow.phase==='fim'&&game.endEventsReady");
assert(rounds>1&&rounds<=40,'A partida deve atingir a vitória em rodadas sucessivas.');
click('reset');check("flow.phase==='preparação'&&flow.round===1&&game.winner===null");
// O jogador escolhe entre tecnologias de maior nível e recursos empatados.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';game.tax={g:1,w:0,s:0,p:2};game.delay=2;state.R1.tech='Salão Imperial';state.R2.tech='Fortaleza';state.R5.tech='Serraria';resources.imperio.ouro=2;resources.imperio.madeira=2;beginScoring()");
assert(element('flowMessage').innerHTML.includes('id="penaltyTech"')&&element('flowMessage').innerHTML.includes('id="penaltyResource"'),'Empates de imposto exigem as escolhas do jogador.');
set('penaltyTech','R2');set('penaltyResource','madeira');click('confirmPenalty');
check("state.R1.tech==='Salão Imperial'&&state.R2.tech===null&&state.R5.tech==='Serraria'&&resources.imperio.ouro===2&&resources.imperio.madeira===1&&game.delay===0&&game.tax!==null&&flow.phase==='pontuação'");
console.log('Rodada com ações das quatro facções e partida até a vitória verificadas.');
`;
vm.runInNewContext(harness + scenario, { require, console, process, __dirname });
