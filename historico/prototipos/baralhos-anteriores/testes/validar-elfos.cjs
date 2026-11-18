'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
const scenario = String.raw`
check("definitions.length===11&&edges.length===18&&factionIds.length===4&&cardDefs.elfos.reduce((n,c)=>n+c[1],0)===23");
check("state.R6.units.elfos===2&&state.R10.units.elfos===2&&state.R3.tower&&resources.elfos.ouro===0&&resources.elfos.madeira===0");
run("scoreRound()");check("game.score.elfos===1");run("scoreRound()");check("game.score.elfos===1");
run("flow.round=2;state.R2.units.imperio=0;state.R2.units.elfos=1;state.R4.units.necromante=0;state.R4.units.elfos=1;scoreRound()");check("game.score.elfos===3");
run("state=initial();resources=initialResources();game=newGame();state.R1.units.elfos=1;state.R8.units.elfos=1;executeCard('elfos','Frutos da Mata','R6',0)");check("resources.elfos.madeira===2&&resources.elfos.ouro===1");
run("game=newGame();resources=initialResources();resources.elfos.ouro=3;transfer('elfos','piratas','ouro',1);transfer('elfos','piratas','ouro',1);transfer('elfos','imperio','ouro',1)");check("game.score.elfos===2");
run("state=initial();resources=initialResources();resources.elfos.ouro=3");set('miracleGive','ouro');set('miracleTake','madeira');
for(let i=1;i<=11;i++){set('miracleFrom-R'+i,'0');set('miracleTo-R'+i,'0')}
run("executeCard('elfos','Milagre da Floresta','R6',0)");check("resources.elfos.ouro===0&&resources.elfos.madeira===2");
run("state=initial();resources=initialResources()");set('filhosCost','tropas');set('filhosOrigin','R10');run("executeCard('elfos','Filhos da Floresta','R6',0)");check("state.R10.units.elfos===1&&state.R6.units.elfos===3");
run("state=initial();resources=initialResources();game=newGame();state.R6.units.piratas=1;state.R6.units.imperio=2;state.R6.units.necromante=1");
set('other','piratas');set('decision','yes');set('giveGold','0');set('giveWood','0');set('takeGold','0');set('takeWood','0');
for(let i=1;i<=11;i++)for(const prefix of ['giveFrom-','giveTo-','takeFrom-','takeTo-'])set(prefix+'R'+i,'0');
set('giveFrom-R10','1');set('giveTo-R5','1');set('takeFrom-R6','1');set('takeTo-R10','1');run("executeCard('elfos','Harmônia','R6',0)");
check("state.R10.units.elfos===2&&state.R5.units.piratas===2&&state.R6.units.piratas===0&&game.score.elfos===1");
run("state=initial();game=newGame();state.R6.units.piratas=0;state.R6.units.imperio=1;afterBattle({f:'elfos',defender:'piratas',region:'R6',card:'Furia da Ilha',destroy:0},state.R6,{defenderLoss:1,attackerLoss:0},[])");check("game.score.elfos===1");
// Recuperação imediata permite escolher separadamente as três florestas.
run("state=initial();game=newGame();flow=newFlow();for(const r of definitions)state[r.id].units.elfos=0;renderFlow()");
assert(element('flow').innerHTML.includes('Vingança da Terra'));
set('elfRevive1','R2');set('elfRevive2','R2');set('elfRevive3','R10');click('confirmElfRevive');
check("state.R2.units.elfos===2&&state.R10.units.elfos===1");
// Ao atacar, a proteção consome a segunda ação e reduz o dano.
run("state=initial();game=newGame();flow=newFlow();flow.phase='resolução';flow.markers=[{f:'elfos',region:'R6',used:false},{f:'elfos',region:null,used:false}];flow.decks.elfos.hand=[{name:'Furia da Ilha'},{name:'Conhecimentos da Floresta'}];state.R6.units.imperio=1;state.R6.units.elfos=1;battle={f:'elfos',defender:'imperio',region:'R6',ci:0,mi:0,card:'Furia da Ilha',stage:'reaction'};renderBattle()");
click('useAttackDefense');check("flow.markers.every(m=>m.used)&&flow.decks.elfos.discard.some(c=>c.name==='Conhecimentos da Floresta')");click('skipDefense');click('skipPeace');run('Math.random=()=>0.8');click('rollBattle');check("battle.attProtection===1&&battle.result.attackerLoss===0");click('applyBattle');
console.log('Pontuação, coleta, trocas, conversão e recrutamento élficos verificados.');
`;
vm.runInNewContext(harness + scenario, { require, console, process, __dirname });
