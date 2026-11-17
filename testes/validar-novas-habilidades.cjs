'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const base = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8').split('// Links dos módulos atuais')[0];
for (const file of ['mapa-fluxo-dinamico.html']) {
 const harness = base.replace("const html = read('mapa-fluxo-dinamico.html');", `const html = read('${file}');`);
 const scenario = String.raw`
// A compra precede a regeneração da Torre e o alistamento.
run("state.R4.units.necromante=0;state.R4.extractor=false;state.R3.units.necromante=4");
set('handSize',5);set('orderChoice','imperio');click('startRound');
check("flow.decks.necromante.hand.length===5&&state.R3.units.necromante===5&&flow.phase==='alistamento'");
set('imperialRecruit','R1');click('confirmImperialRecruit');check("flow.phase==='leilão'&&state.R1.units.imperio===3");
run("towerRoundReinforcement()");check("state.R3.units.necromante===5");
// Sem domínio imperial e com seis tropas, a recuperação recebe apenas uma.
click('reset');run("state.R1.units.imperio=6;state.R1.units.necromante=6;state.R2.units.imperio=0");
set('handSize',5);set('orderChoice','imperio');click('startRound');set('imperialRecruit','R2');click('confirmImperialRecruit');
check("Object.values(state).reduce((n,s)=>n+s.units.imperio,0)===7&&flow.phase==='leilão'");
click('reset');run("state.R1.units.imperio=7");set('handSize',5);set('orderChoice','imperio');click('startRound');check("flow.phase==='leilão'&&state.R1.units.imperio===7");
// Impostos descartados voltam ao baralho e sempre há imposto quando existem cartas.
run("game=newGame();game.taxes=[];game.taxDiscard=[{g:1,w:0,s:0,p:2}];game.tax={g:0,w:1,s:0,p:3};replaceTax()");
check("game.tax!==null&&game.taxes.length===1&&game.taxDiscard.length===0");
// Perda de controle remove tropas e construções e preserva só a Torre e seus dois zumbis.
run("state=initial();state.R4.monument=true;state.R4.units.imperio=2;state.R3.units.imperio=2;state.R3.tech='Serraria';state.R3.bar=true;state.R3.buildings.piratas=1");
check("restoreTowerIfLost()&&state.R3.tower&&state.R3.units.necromante===2&&state.R3.units.imperio===0&&!state.R3.tech&&!state.R3.bar&&state.R3.buildings.piratas===0&&!state.R4.extractor&&!state.R4.monument&&state.R4.units.necromante===0&&state.R4.units.imperio===2");
// Uma tecnologia continua concedendo seu efeito mesmo sem domínio imperial.
run("state=initial();resources=initialResources();game=newGame();state.R2.tech='Serraria';state.R2.units.imperio=0;state.R2.units.elfos=2;flow.decks.imperio.hand=[{name:'Assegurar Recursos para o Rei'}];state.R1.units.imperio=1");
check("hasTech('Serraria')&&calcOwner(state.R2)!=='imperio'");
set('extra',0);run("state.R1.tech='Mercado Local';state.R1.units.imperio=0;state.R1.units.piratas=2;state.R9.units.imperio=1;executeCard('imperio','Assegurar Recursos para o Rei','R9',0)");
check("resources.imperio.ouro===3");
// Pré-requisito existente em região não dominada permite construir tecnologia.
run("state=initial();resources.imperio={ouro:10,madeira:10};game=newGame();state.R2.tech='Serraria';state.R2.units.imperio=0;state.R2.units.elfos=2;state.R6.units.imperio=1");
set('tech','Mercado Local');run("executeCard('imperio','O Progresso','R6',0)");check("state.R6.tech==='Mercado Local'");
// Construção exige tropa, mas não domínio; coleta aceita tropa ou construção, não região vazia.
run("state=initial();resources.imperio={ouro:10,madeira:10};state.R6.units.imperio=1;state.R6.units.necromante=2");set('tech','Serraria');
run("executeCard('imperio','O Progresso','R6',0)");check("state.R6.tech==='Serraria'");
set('extra',0);run("flow.decks.imperio.hand=[{name:'Assegurar Recursos para o Rei'}];state.R6.units.imperio=0;executeCard('imperio','Assegurar Recursos para o Rei','R6',0)");
check("(()=>{try{executeCard('imperio','Assegurar Recursos para o Rei','R9',0);return false}catch(e){return true}})()");
// Movimento para a Torre pode disparar seu efeito antes da batalha.
run("state=initial();resources=initialResources();game=newGame();flow=newFlow();flow.phase='resolução';flow.order=factionIds.slice();flow.turn=0;flow.markers=[{f:'imperio',region:'R3',used:false}];flow.decks.imperio.hand=[{name:'Tambores de Guerra',text:'Ataque'}];state.R4.units.imperio=2;showAttackMovement('imperio',0,0)");
set('attackDefender','necromante');set('move-R4',2);click('prepareAttack');
check("battle===null&&flow.markers[0].used&&state.R3.tower&&state.R3.units.necromante===2&&state.R3.units.imperio===0&&!state.R4.extractor");
console.log('Novas habilidades e condições verificadas: ${file}');
`;
 vm.runInNewContext(harness + scenario, { require, console, process, __dirname });
}
