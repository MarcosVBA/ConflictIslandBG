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
const section = text.split('## Baralho registrado')[1]?.split('\\n## ')[0];
const documented = [...section.matchAll(/^\\|\\s*([^|]+?)\\s*\\|\\s*(\\d+)\\s*\\|/gm)].map(m=>[m[1].trim(),Number(m[2])]);
const implemented = JSON.parse(run('JSON.stringify(cardDefs.necromante.map(([name,count])=>[name,count]))'));
assert(JSON.stringify(documented)===JSON.stringify(implemented),'Baralho divergente: ${file}');
check("cardDefs.necromante.reduce((n,c)=>n+c[1],0)===20&&cardDefs.necromante.find(c=>c[0]==='Remanejando Mortos')[1]===2&&!cardDefs.necromante.some(c=>c[0]==='Despertar para a Morte')");
check("newFlow().decks.necromante.draw.length===20&&!Object.hasOwn(leadershipValues,'Despertar para a Morte')");
assert(text.includes('| Despertar para a Morte | 1 Madeira |'),'A magia deve permanecer documentada.');
set('spell','Despertar para a Morte');set('other','imperio');
run("state=initial();resources=initialResources();game=newGame()");
check("(()=>{try{executeCard('necromante','Magia das Trevas','R1',0);return false}catch(e){return resources.necromante.madeira===1&&state.R1.units.imperio===2}})()");
run("executeCard('necromante','Magia das Trevas','R2',0)");
check("resources.necromante.madeira===0&&state.R2.units.imperio===0&&state.R2.units.necromante===1");
// A exigência de Madeira deve bloquear a ação inteira, inclusive descarte e pontuação.
run("state=initial();resources=initialResources();resources.necromante.madeira=0;game=newGame();flow=newFlow();flow.phase='resolução';flow.order=['necromante',...factionIds.filter(f=>f!=='necromante')];flow.turn=0;flow.markers=[{f:'necromante',region:'R3',used:false}];flow.decks.necromante.hand=[{name:'Monumento a Morte',text:cardDefs.necromante.find(c=>c[0]==='Monumento a Morte')[2]},{name:'Ataque Zumbi',text:''}];renderFlow()");
check("cardDefs.necromante.find(c=>c[0]==='Monumento a Morte')[2].includes('1 Madeira')");
set('actionMarker',0);${file === 'mapa-fluxo-dinamico.html' ? "set('actionRegion','R3');" : ''}cards[0].onclick();click('executeAction');
check("!state.R3.monument&&resources.necromante.madeira===0&&game.score.necromante===0&&!flow.markers[0].used&&flow.decks.necromante.hand.length===2");
assert(element('actionError').textContent.includes('Recursos insuficientes'),'A interface deve explicar o custo não pago.');
run("resources.necromante.madeira=1");click('executeAction');
check("state.R3.monument&&resources.necromante.madeira===0&&game.score.necromante===2&&flow.markers[0].used&&flow.decks.necromante.hand.length===5&&flow.decks.necromante.discard.length===2");
console.log('Baralho, magia e custo do Monumento verificados: ${file}');
`;
  vm.runInNewContext(base + scenario, { require, console, process, __dirname });
}
