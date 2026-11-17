'use strict';
// Reutiliza o DOM substituto do teste principal, em contextos isolados por cenário.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const boundary = '// Links dos módulos atuais';
if (!source.includes(boundary)) throw Error('Base do simulador de DOM não encontrada.');
const harness = source.split(boundary)[0].replace("const html = read('mapa-conflito.html');", "const html = read('mapa-quatro-faccoes.html');");
if (!harness.includes("read('mapa-quatro-faccoes.html')")) throw Error('Não foi possível selecionar o protótipo de quatro facções.');
const scenarios = [
  `
check("!neighbors('R5').includes('R8') && !neighbors('R8').includes('R5') && !neighbors('R9').includes('R2') && !neighbors('R2').includes('R9')");
check("!neighbors('R2').includes('R6') && !neighbors('R6').includes('R2') && neighbors('R2').includes('R10') && neighbors('R10').includes('R2')");
check("(()=>{const seen=new Set(['R1']),queue=['R1'];while(queue.length)for(const n of neighbors(queue.shift()))if(!seen.has(n)){seen.add(n);queue.push(n)}return seen.size===definitions.length})()");
check("byId('R7').name==='Pico Desolado'&&byId('R7').terrain==='montanha'&&!byId('R7').coast&&byId('R7').resource==='Sem recurso'");
check("byId('R9').name==='Baixio dos Garimpeiros'&&byId('R9').terrain==='planicie'&&byId('R9').coast&&byId('R9').resource==='Ouro'");
check("byId('R11').name==='Costa do Ouro Perdido'&&byId('R11').terrain==='praia'&&byId('R11').coast&&byId('R11').resource==='Ouro'");
assert(element('diagnostics').innerHTML.includes('Verificações aprovadas'),'Diagnóstico deve refletir a nova distribuição de recursos.');
for (const [faction, file, heading] of [
  ['elfos', 'faccoes/elfos.md', '## Baralho'],
  ['imperio', 'faccoes/imperio.md', '## Baralho principal proposto'],
]) {
  const section = read(file).split(heading)[1]?.split('\\n## ')[0];
  assert(section, 'Baralho ausente: ' + file);
  const rows = [...section.matchAll(/^\\|\\s*([^|]+?)\\s*\\|\\s*(\\d+)\\s*\\|/gm)].map(m => [m[1].trim(), Number(m[2])]);
  const actual = JSON.parse(run('JSON.stringify(cardDefs.' + faction + '.map(([name,count])=>[name,count]))'));
  assert(JSON.stringify(rows) === JSON.stringify(actual), 'Baralho divergente: ' + file + ' documentado=' + JSON.stringify(rows) + ' implementado=' + JSON.stringify(actual));
}
assert(!/<(?:script|link|img)\\b[^>]*(?:src|href)\\s*=/i.test(html), 'O HTML não deve depender de arquivos externos.');
console.log('Baralhos e funcionamento em arquivo único OK');
`,
  '\ncheck("definitions.length===11 && edges.length===21 && factionIds.length===4 && cardDefs.elfos.reduce((n,c)=>n+c[1],0)===25");\ncheck("state.R6.units.elfos===1 && state.R10.units.elfos===2 && state.R3.tower && resources.elfos.ouro===0 && resources.elfos.madeira===0");\nrun("scoreRound()");check("game.score.elfos===1");run("scoreRound()");check("game.score.elfos===1");\nrun("flow.round=2; state.R2.units.imperio=0;state.R2.units.elfos=1;state.R4.units.necromante=0;state.R4.units.elfos=1;scoreRound()");check("game.score.elfos===3");\nrun("state=initial();resources=initialResources();game=newGame();state.R1.units.elfos=1;state.R8.units.elfos=1;executeCard(\'elfos\',\'Frutos da Mata\',\'R6\',0)");check("resources.elfos.madeira===2 && resources.elfos.ouro===1");\nrun("game=newGame();resources=initialResources();resources.elfos.ouro=3; transfer(\'elfos\',\'piratas\',\'ouro\',1);transfer(\'elfos\',\'piratas\',\'ouro\',1);transfer(\'elfos\',\'imperio\',\'ouro\',1)");check("game.score.elfos===2");\nrun("resources.elfos.madeira=0;resources.elfos.ouro=3; state=initial()");set(\'miracleGive\',\'ouro\');set(\'miracleTake\',\'madeira\');for(let i=1;i<=11;i++){set(\'miracleFrom-R\'+i,\'0\');set(\'miracleTo-R\'+i,\'0\')}run("executeCard(\'elfos\',\'Milagre da Floresta\',\'R6\',0)");check("resources.elfos.ouro===0 && resources.elfos.madeira===2");\nrun("state=initial();resources=initialResources()");set(\'filhosCost\',\'tropas\');set(\'filhosOrigin\',\'R10\');run("executeCard(\'elfos\',\'Filhos da Floresta\',\'R6\',0)");check("state.R10.units.elfos===1 && state.R6.units.elfos===2");\nconsole.log(\'Mapa, pontuação, coleta, trocas, conversão e recrutamento élficos OK\');',
  '\\nrun("flow.phase=\'resolução\'; flow.turn=0; flow.markers=[{f:\'imperio\',region:\'R1\',used:false},{f:\'elfos\',region:\'R10\',used:false}]; flow.decks.imperio.hand=[{name:\'Marcha Imperial\'}]; flow.decks.elfos.hand=[{name:\'Canção de paz\'}]; state.R1.units.imperio=2; state.R1.units.necromante=1; battle={f:\'imperio\',defender:\'necromante\',region:\'R1\',ci:0,mi:0,card:\'Marcha Imperial\',stage:\'reaction\'}; renderBattle()");\\nset(\'battleReaction\',\'none\'); element(\'peaceUse\').checked=true;set(\'peaceMarker\',\'1\');click(\'rollBattle\');\\ncheck("battle.stage===\'result\' && battle.result.swords===0 && battle.result.crosses===0 && battle.attackDice.length===0");\\nclick(\'applyBattle\');\\ncheck("battle===null && state.R1.units.imperio===2 && state.R1.units.necromante===1 && flow.markers[0].used && flow.markers[1].used && flow.decks.elfos.discard.some(c=>c.name===\'Canção de paz\')");\\nrun("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase=\'resolução\';flow.markers=[{f:\'imperio\',region:\'R1\',used:false},{f:\'elfos\',region:\'R6\',used:false},{f:\'elfos\',region:\'R10\',used:false}];flow.decks.imperio.hand=[{name:\'Marcha Imperial\'}];flow.decks.elfos.hand=[{name:\'Conhecimentos da Floresta\'},{name:\'Canção de paz\'}];state.R6.units.imperio=1;battle={f:\'imperio\',defender:\'elfos\',region:\'R6\',ci:0,mi:0,card:\'Marcha Imperial\',stage:\'reaction\'};renderBattle()");set(\'battleReaction\',\'defense\');set(\'battleReactionMarker\',\'1\');element(\'peaceUse\').checked=true;set(\'peaceMarker\',\'2\');click(\'rollBattle\');click(\'applyBattle\');check("flow.markers.every(m=>m.used) && flow.decks.elfos.discard.length===2");\nrun("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase=\'resolução\';flow.turn=3;flow.markers=[{f:\'elfos\',region:\'R10\',used:false},{f:\'elfos\',region:\'R6\',used:false}];flow.decks.elfos.hand=[{name:\'Canção de paz\'},{name:\'Furia da Ilha\'}];state.R6.units.imperio=1;battle={f:\'elfos\',defender:\'imperio\',region:\'R6\',ci:1,mi:0,card:\'Furia da Ilha\',stage:\'reaction\'};renderBattle()");set(\'battleReaction\',\'none\');element(\'peaceUse\').checked=true;set(\'peaceMarker\',\'1\');click(\'rollBattle\');click(\'applyBattle\');check("flow.decks.elfos.hand.length===0 && flow.decks.elfos.discard.length===2 && flow.decks.elfos.discard.some(c=>c.name===\'Furia da Ilha\')");\nconsole.log(\'Canção de paz: combate 0 a 0, tropas preservadas e marcadores e reação gastos\');',
  '\nfor(let i=1;i<=6;i++){\n set(\'handSize\',5);set(\'orderChoice\',\'imperio\');click(\'startRound\');if(run("flow.phase===\'alistamento\'")){set(\'imperialRecruit\',\'R1\');click(\'confirmImperialRecruit\')}for(let j=0;j<4;j++)click(\'passBid\');check("flow.phase===\'alocação\'");\n for(let k=0;k<8;k++){set(\'markerRegion\',\'R1\');click(\'addMarker\')}\n click(\'finishAllocation\');check("flow.phase===\'resolução\'");while(run("activeFaction()!==null")){set(\'actionMarker\',run("flow.markers.findIndex(m=>m.f===activeFaction()&&!m.used)"));click(\'passAction\')}click(\'toScore\');check("flow.phase===\'pontuação\'");click(\'nextRound\');\n}\ncheck("flow.phase===\'fim\'&&flow.round===6 && game.imperialRecruitRound===6");click(\'reset\');check("flow.round===1&&flow.phase===\'preparação\'&&state.R1.units.imperio===2&&state.R10.units.elfos===2");\nconsole.log(\'Seis rodadas, alistamento e reinício OK\');',
  '\nrun("flow.phase=\'resolução\';flow.turn=3;flow.markers=[{f:\'elfos\',region:\'R10\',used:false}];flow.decks.elfos.hand=[{name:\'Furia da Ilha\',text:\'mover\'}];showPlayableAction(\'elfos\',0,0)");\nset(\'destination\',\'R11\');set(\'quantity\',\'1\');set(\'attackDefender\',\'piratas\');click(\'elfFuryGo\');check("state.R10.units.elfos===1 && state.R11.units.elfos===1 && flow.markers[0].used && flow.decks.elfos.discard[0].name===\'Furia da Ilha\'");\nrun("state=initial();flow=newFlow();flow.phase=\'resolução\';flow.turn=3;flow.markers=[{f:\'elfos\',region:\'R10\',used:false}];flow.decks.elfos.hand=[{name:\'Furia da Ilha\',text:\'mover\'}];state.R11.units.piratas=1;showPlayableAction(\'elfos\',0,0)");set(\'destination\',\'R11\');set(\'quantity\',\'1\');set(\'attackDefender\',\'piratas\');click(\'elfFuryGo\');check("battle && battle.f===\'elfos\' && battle.defender===\'piratas\' && state.R11.units.elfos===1");console.log(\'Movimento e declaração de combate de Furia da Ilha OK\');',
];
for (const [i, scenario] of scenarios.entries()) {
  const code = i === 0 ? scenario : scenario.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  vm.runInNewContext(harness + code, { require, console, process, __dirname });
}

vm.runInNewContext(harness + `
run("state=initial();resources=initialResources();game=newGame();state.R6.units.piratas=1;state.R6.units.imperio=2;state.R6.units.necromante=1");
set('other','piratas');set('decision','yes');set('giveGold','0');set('giveWood','0');set('takeGold','0');set('takeWood','0');
for(let i=1;i<=11;i++)for(const prefix of ['giveFrom-','giveTo-','takeFrom-','takeTo-'])set(prefix+'R'+i,'0');
set('giveFrom-R10','1');set('giveTo-R5','1');set('takeFrom-R6','1');set('takeTo-R10','1');
run("executeCard('elfos','Harmônia','R6',0)");
check("state.R10.units.elfos===2 && state.R5.units.piratas===2 && state.R6.units.piratas===0 && game.score.elfos===1");
run("state=initial();game=newGame();state.R6.units.piratas=0;state.R6.units.imperio=1;afterBattle({f:'elfos',defender:'piratas',region:'R6',card:'Furia da Ilha',destroy:0},state.R6,{defenderLoss:1,attackerLoss:0},[])");
check("game.score.elfos===1");
console.log('Troca de tropas e pontuação com terceiro presente OK');
`, { require, console, process, __dirname });

vm.runInNewContext(harness + `
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['imperio','necromante','piratas','elfos'];flow.turn=2;flow.markers=[{f:'piratas',region:'R9',used:false}];flow.decks.piratas.hand=[{name:'Invasão Costeira',text:'Navegar'}];state.R7.units.piratas=1;state.R11.units.piratas=1;showAttackMovement('piratas',0,0)");
assert(element('cardDetail').innerHTML.includes('move-R5')&&element('cardDetail').innerHTML.includes('move-R11')&&!element('cardDetail').innerHTML.includes('move-R7'),'Origens costeiras da invasão estão incorretas.');
set('move-R5',1);set('move-R11',0);set('attackDefender','imperio');click('prepareAttack');
check("state.R9.units.piratas===1&&state.R7.units.piratas===1&&flow.markers[0].used");
set('extra',0);run("resources.imperio.ouro=0;state.R9.units.imperio=1;state.R11.units.imperio=1;flow.decks.imperio.hand=[{name:'Assegurar Recursos para o Rei'}];executeCard('imperio','Assegurar Recursos para o Rei','R9',0);executeCard('imperio','Assegurar Recursos para o Rei','R11',0)");
check("resources.imperio.ouro===2");
console.log('Costa e coleta de Ouro nas regiões alteradas OK');
`, { require, console, process, __dirname });
