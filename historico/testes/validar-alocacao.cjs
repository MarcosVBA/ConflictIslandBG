'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'testes/validar-documentacao.cjs'), 'utf8');
const harness = source.split('// Links dos módulos atuais')[0];
for (const [file, seats] of [
  ['mapa-conflito.html', ['imperio', 'necromante', 'piratas']],
  ['mapa-quatro-faccoes.html', ['imperio', 'necromante', 'piratas', 'elfos']],
]) {
  const base = harness.replace("const html = read('mapa-conflito.html');", `const html = read('${file}');`);
  const scenario = `
const seats = ${JSON.stringify(seats)};
for(const leader of seats){
  click('reset');set('orderChoice',leader);set('handSize',5);click('startRound');
  set('imperialRecruit','R1');click('confirmImperialRecruit');
  for(let i=0;i<seats.length;i++)click('passBid');
  const index=seats.indexOf(leader),order=seats.slice(index).concat(seats.slice(0,index)),expected=order.slice(1).concat(order[0]);
  assert(run('flow.allocationFaction')===expected[0],'Primeira alocação deve caber ao próximo jogador.');
  click('finishAllocation');check("flow.phase==='alocação'");
  for(let i=0;i<2*seats.length;i++){
    assert(run('flow.allocationFaction')===expected[i%seats.length],'Ordem incorreta de alocação.');
    set('markerRegion','R1');click('addMarker');
  }
  check('flow.allocationFaction===null');
  assert(JSON.stringify(JSON.parse(run('JSON.stringify(flow.markers.map(m=>m.f))')))===JSON.stringify(expected.concat(expected)),'Duas voltas não respeitam a ordem.');
  click('addMarker');check('flow.markers.length===2*flow.order.length');
  click('undoAllocation');assert(run('flow.allocationFaction')===leader,'Desfazer o último marcador deve devolver a vez ao líder.');
  click('finishAllocation');check("flow.phase==='alocação'");
  set('markerRegion','R1');click('addMarker');click('finishAllocation');
  check("flow.phase==='resolução' && activeFaction()===flow.order[0] && flow.markers.every(m=>!m.used)");
}
console.log('Duas voltas, líder por último e desfazer verificados: ${file}');
`;
  vm.runInNewContext(base + scenario, { require, console, process, __dirname });
}
