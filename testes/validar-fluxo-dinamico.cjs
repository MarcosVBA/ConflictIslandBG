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
regions.find(r=>r.attributes['data-region']==='R1').onclick();assert(element('imperialRecruit').value==='R1','Alistamento deve aceitar escolha direta no mapa.');click('confirmImperialRecruit');
check("flow.phase==='leilão'&&state.R1.units.imperio===3&&game.imperialRecruitRound===1");
for(let i=0;i<4;i++)click('passBid');
check("flow.phase==='resolução'&&activeFaction()==='imperio'&&flow.markers.length===8&&flow.markers.every(m=>!m.used&&m.region===null)");
check("factionInfo('imperio').includes('Imposto')&&factionInfo('imperio').includes('Tecnologias')");assert(element('statusBar').innerHTML.includes('data-faction-info="imperio"'),'O símbolo deve oferecer acesso às informações imperiais.');
assert(!element('flow').innerHTML.includes('id="addMarker"'),'Alocação antecipada não deve estar disponível.');
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
// O pagamento do Corsário permanece disponível até a pontuação e não encerra a ação.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['piratas','elfos','imperio','necromante'];flow.markers=[{f:'piratas',region:'R5',used:false}];flow.decks.piratas.hand=[{name:'Carta de Corsário / Serviço de Transporte Pirata'}];state.R5.units.imperio=1;game.score.piratas=29;showCorsair('piratas',0,0)");
set('corsairAlly','imperio');set('decision','yes');set('price',1);set('destination','R6');set('quantity',1);set('corsairMode','move');set('attackDefender','necromante');click('corsairGo');check("game.winner===null&&game.score.piratas===29&&resources.piratas.ouro===1&&state.R5.units.piratas===0&&state.R6.units.piratas===1&&flow.markers[0].used&&battle===null");
// O transporte inválido é recusado antes do pagamento.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();state.R5.units.imperio=1;game.score.piratas=29");
set('other','imperio');set('decision','yes');set('price',1);set('transportOrigin','R1');set('destination','R1');set('quantity',1);
check("(()=>{try{executeCard('piratas','Serviço de Transporte Pirata','R5',0);return false}catch(e){return true}})()&&game.winner===null&&resources.imperio.ouro===1&&resources.piratas.ouro===0");
// Ouro de saque e acordo permanece negociável; só o saldo com a renda do Bar pontua.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';resources.imperio.ouro=3;state.R5.bar=true;lootGold(resources,'imperio',1);afterBattle({f:'piratas',defender:'imperio',region:'R5',card:'Invasão Costeira',destroy:0},state.R5,{defenderLoss:1,attackerLoss:0},['inimigo']);transfer('imperio','piratas','ouro',2)");
check("resources.piratas.ouro===3&&game.score.piratas===0");
run("transfer('piratas','necromante','ouro',2)");check("resources.piratas.ouro===1&&resources.necromante.ouro===2&&game.score.piratas===0");
run("scoreRound()");check("resources.piratas.ouro===0&&game.score.piratas===2");
run("scoreRound()");check("resources.piratas.ouro===0&&game.score.piratas===2");
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();game.score.piratas=29;resources.piratas.ouro=1;scoreRound()");check("game.winner==='piratas'&&resources.piratas.ouro===0&&game.score.piratas===30");
click('reset');check("flow.round===1&&flow.phase==='preparação'&&flow.markers.length===0&&state.R1.units.imperio===2");
assert(!/<(?:script|link|img)\b[^>]*(?:src|href)\s*=/i.test(html.replace(/<script>[\s\S]*?<\/script>/g,'')),'O protótipo deve funcionar sem dependências externas obrigatórias.');
console.log('Seis rodadas e reinício OK');
`;
vm.runInNewContext(harness + scenario, { require, console, process, __dirname });
