'use strict';

// Verifica dados documentados e comportamento essencial sem navegador ou dependências.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('mapa-conflito.html');
const elements = new Map();
let cards = [], previews = [], regions = [], checkedBuildings = [];
const classes = () => ({ add() {}, remove() {}, toggle() {} });
function createCard(index, kind) {
  return { dataset: { [kind === 'preview' ? 'previewIndex' : 'cardIndex']: index }, classList: classes(), disabled: false, setAttribute() {} };
}
function element(id) {
  if (elements.has(id)) return elements.get(id);
  const e = {
    id, _value: '', _html: '', checked: false, textContent: '', hidden: false,
    disabled: false, style: {}, classList: classes(),
    get value() { return String(this._value); }, set value(v) { this._value = v; },
    get innerHTML() { return this._html; },
    set innerHTML(v) {
      this._html = v;
      if (this.id === 'flow') {
        // No DOM real, renderizar o fluxo recria o botão oculto de carta.
        if (elements.has('showCard')) elements.get('showCard').disabled = false;
        cards = [...v.matchAll(/data-card-index="(\d+)"/g)].map(x => createCard(x[1], 'card'));
        previews = [...v.matchAll(/data-preview-index="(\d+)"/g)].map(x => createCard(x[1], 'preview'));
      }
    },
    attributes: {}, setAttribute(k, v) { this.attributes[k] = String(v); }, scrollBy() {},
    focus() { this.focused = true; context.document.activeElement = this; },
    querySelector(q) {
      const match = q.match(/^\[data-region="(R\d+)"\]$/);
      return this.id === 'map' && match ? regions.find(x => x.attributes['data-region'] === match[1]) || null : null;
    },
    querySelectorAll(q) {
      if (this.id === 'flow' && q === '[data-card-index]') return cards;
      if (this.id === 'flow' && q === '[data-preview-index]') return previews;
      if (this.id === 'map' && q === '.region') return regions;
      if (q === '.destroyBuilding:checked') return checkedBuildings;
      return [];
    },
    appendChild(x) { if (this.id === 'map') regions.push(x); },
    remove() { regions = regions.filter(x => x !== this); },
  };
  elements.set(id, e);
  return e;
}
const context = { document: { getElementById: element, createElement: () => element(Math.random()) }, window: { matchMedia: () => ({ matches: true }) } };
vm.createContext(context);
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (!scripts.length) throw new Error('Nenhum script encontrado no HTML.');
for (const script of scripts) vm.runInContext(script[1], context, { timeout: 1000 });
const run = expr => vm.runInContext(expr, context, { timeout: 1000 });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const check = (expr, message = expr) => assert(run(expr), message);
const set = (id, value) => { element(id).value = value; };
const click = id => { const e = element(id); assert(typeof e.onclick === 'function', `Controle indisponível: ${id}`); e.onclick(); };

// Links dos módulos atuais não dependem dos caminhos históricos antigos.
const modules = ['README.md', 'regras/regras-gerais.md', 'regras/combate.md', 'regras/dados.md', 'regras/mapa.md', 'regras/pontuacao.md', 'faccoes/piratas.md', 'faccoes/necromante.md', 'faccoes/imperio.md', 'faccoes/elfos.md', 'faccoes/dragoes.md', 'ideias/eventos.md', 'ideias/pontuacao.md', 'ideias/tensao-madeira.md', 'prototipo/estado-e-testes.md', 'historico/README.md'];
for (const file of modules) {
  for (const match of read(file).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const href = match[1].split('#')[0];
    if (!href || /^[a-z]+:/i.test(href)) continue;
    assert(fs.existsSync(path.resolve(root, path.dirname(file), decodeURIComponent(href))), `Link quebrado em ${file}: ${href}`);
  }
}

// Cada documento de facção é a fonte de nomes e quantidades do seu baralho.
for (const [faction, file, section] of [
  ['piratas', 'faccoes/piratas.md', '## Baralho registrado'],
  ['necromante', 'faccoes/necromante.md', '## Baralho registrado'],
  ['imperio', 'faccoes/imperio.md', '## Baralho principal proposto'],
]) {
  const text = read(file).split(section)[1]?.split('\n## ')[0];
  assert(text, `Seção de baralho ausente: ${file}`);
  const rows = [...text.matchAll(/^\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|/gm)].map(m => [m[1].trim(), Number(m[2])]);
  const implemented = JSON.parse(run(`JSON.stringify(cardDefs.${faction}.map(([name,count])=>[name,count]))`));
  // O HTML de três facções é preservado: sua versão anterior usa uma cópia adicional de Alistamento.
  const legacyRows = rows.map(([name, count]) => [name, faction === 'imperio' && name === 'Alistamento' ? count + 1 : count]);
  assert(JSON.stringify(legacyRows) === JSON.stringify(implemented), `Cartas ou quantidades divergentes no protótipo de três facções: ${file}`);
  assert(rows.reduce((n, row) => n + row[1], 0) === ({piratas:23,necromante:20,imperio:23}[faction]), `Quantidade de cartas inesperada: ${file}`);
}

// A proposta de quatro facções é documentada separadamente e ainda não está no HTML.
const mapText = read('regras/mapa.md').split('## Proposta para quatro facções')[0];
const rows = [...mapText.matchAll(/^\|\s*(R\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(Sim|Não)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm)];
const defs = JSON.parse(run('JSON.stringify(definitions)'));
assert(rows.length === defs.length, 'Quantidade de regiões divergente.');
// Margens dos cartões no menor tabuleiro previsto, sem sobreposição de áreas clicáveis.
for (let i = 0; i < defs.length; i++) for (let j = i + 1; j < defs.length; j++) {
  const dx = Math.abs(defs[i].x - defs[j].x) * 680 / 100;
  const dy = Math.abs(defs[i].y - defs[j].y) * 560 / 100;
  assert(dx >= 150 || dy >= 145, `Regiões sobrepostas: ${defs[i].id} e ${defs[j].id}`);
}
for (const row of rows) {
  const [, id, name, terrain, coast, resource, start] = row, r = defs.find(x => x.id === id);
  assert(r && r.name === name.trim() && r.terrain === terrain.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') && r.coast === (coast === 'Sim') && r.resource === (resource.trim() === 'Nenhum' ? 'Sem recurso' : resource.trim()), `Região divergente: ${id}`);
  const initialState = JSON.parse(run(`JSON.stringify(state[${JSON.stringify(id)}])`));
  const startMatch = start.trim().match(/^(Império|Necromante|Piratas):\s*(\d+)/);
  const faction = startMatch && { 'Império': 'imperio', 'Necromante': 'necromante', 'Piratas': 'piratas' }[startMatch[1]];
  assert(startMatch || start.trim() === 'Livre', `Início não reconhecido: ${id}`);
  assert(initialState.owner === (faction || 'livre'), `Domínio inicial divergente: ${id}`);
  for (const f of ['imperio', 'necromante', 'piratas']) assert(initialState.units[f] === (f === faction ? Number(startMatch[2]) : 0), `Tropas iniciais divergentes: ${id} / ${f}`);
  assert(initialState.tower === /\bTorre\b/.test(start) && initialState.extractor === /extrator/i.test(start), `Construção inicial divergente: ${id}`);
}
const resourceStart = mapText.match(/O Império começa com (\d+) Ouro; o Necromante com (\d+) Madeira; Piratas começam sem recursos/);
assert(resourceStart, 'Recursos iniciais não encontrados no mapa.');
check(`resources.imperio.ouro===${Number(resourceStart[1])}&&resources.imperio.madeira===0&&resources.necromante.madeira===${Number(resourceStart[2])}&&resources.necromante.ouro===0&&resources.piratas.ouro===0&&resources.piratas.madeira===0`, 'Recursos iniciais divergentes.');
const documentedEdges = [...mapText.matchAll(/\b(R\d+)-(R\d+)\b/g)].map(m => [m[1], m[2]].sort().join('-')).sort();
const actualEdges = JSON.parse(run('JSON.stringify(edges)')).map(e => e.sort().join('-')).sort();
assert(JSON.stringify(documentedEdges) === JSON.stringify(actualEdges), 'Conexões do mapa divergentes.');

const faceMap = { 'Vazia': [0, 0], 'Uma espada': [1, 0], 'Uma cruz': [0, 1], 'Duas cruzes': [0, 2], 'Uma espada e uma cruz': [1, 1], 'Duas espadas e uma cruz': [2, 1] };
const faceRows = [...read('regras/dados.md').matchAll(/^\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm)];
const expectedDice = [[], []];
for (const [, rawName, attack, defense] of faceRows) {
  const face = faceMap[rawName.trim()];
  assert(face, `Face desconhecida: ${rawName}`);
  for (let i = 0; i < Number(attack); i++) expectedDice[0].push(face.join(','));
  for (let i = 0; i < Number(defense); i++) expectedDice[1].push(face.join(','));
}
const actualDice = JSON.parse(run('JSON.stringify([attackFaces,defenseFaces])'));
for (let i = 0; i < 2; i++) assert(JSON.stringify(expectedDice[i].sort()) === JSON.stringify(actualDice[i].map(x => x.join(',')).sort()), 'Faces dos dados divergentes.');

check("(()=>{let s=clone(state.R4);s.units={imperio:2,necromante:2,piratas:1};return calcOwner(s)==='livre'&&!devastated(s)})()", 'Empate ou região devastada incorreta.');
check("(()=>{let s=clone(state.R4);s.units={imperio:0,necromante:0,piratas:0};s.buildings.imperio=1;return calcOwner(s)==='livre'&&!devastated(s)})()", 'Domínio por construções incorreto.');
check("(()=>{let d=battleDamage(3,1,[[2,1],[2,1],[1,1]],[],0,2);return d.defenderLoss===1&&d.attackerLoss===1&&d.overflow===3})()", 'Limites ou dano excedente incorretos.');
check("(()=>{let r=initialResources();r.imperio.ouro=1;return lootGold(r,'imperio',2).join(',')==='inimigo,reserva'&&r.piratas.ouro===2})()", 'Saque e reserva incorretos.');

// Partida de seis rodadas: baralhos ordenados no início e dados determinísticos.
function prime(f, name) {
  run(`(()=>{const d=flow.decks[${JSON.stringify(f)}].draw,i=d.findIndex(c=>c.name===${JSON.stringify(name)});if(i<0)throw Error('Carta ausente');d.push(d.splice(i,1)[0])})()`);
}
function prepare(order) {
  const first = order.split(',')[0];
  set('orderChoice', first); set('handSize', 5); click('startRound'); if (run("flow.phase==='alistamento'")) { set('imperialRecruit','R1'); click('confirmImperialRecruit'); }
  const needsNewLeader = run('flow.order[0]') !== first;
  if (needsNewLeader) run(`flow.decks[${JSON.stringify(first)}].hand.push({name:'Carta de teste',leadership:1,text:''});renderFlow()`);
  while (run("flow.phase==='leilão'")) {
    if (needsNewLeader && run('flow.order[flow.auction.turn]') === first) {
      const index = run(`flow.decks[${JSON.stringify(first)}].hand.length-1`);
      element('bid-'+index).checked = true; click('submitBid'); element('bid-'+index).checked = false;
    } else click('passBid');
  }
  check("flow.phase==='alocação'");
}
const plannedMarkers = {};
function marker(f, r) { (plannedMarkers[f] ||= []).push(r); }
function confirmAll() {
  while (run('flow.allocationFaction!==null')) {
    const f = run('flow.allocationFaction'), region = plannedMarkers[f]?.shift() || 'R1';
    set('markerRegion', region); click('addMarker');
  }
  click('finishAllocation');
}
function play(f, name, markerIndex) {
  check(`activeFaction()===${JSON.stringify(f)}`);
  set('actionMarker', run(`flow.markers.findIndex(m=>m.f===${JSON.stringify(f)}&&!m.used)`));
  const index = run(`flow.decks[${JSON.stringify(f)}].hand.findIndex(x=>x.name===${JSON.stringify(name)})`);
  assert(index >= 0, `Carta não está na mão: ${name}`);
  const button = cards.find(x => Number(x.dataset.cardIndex) === index);
  assert(button && typeof button.onclick === 'function', `Carta sem controle: ${name}`);
  button.onclick();
}
function score() { while (run('activeFaction()!==null')) { set('actionMarker', run('flow.markers.findIndex(m=>m.f===activeFaction()&&!m.used)')); click('passAction'); } click('toScore'); check("flow.phase==='pontuação'"); }

check('flow.handSize===5', 'O tamanho inicial da mão deve ser cinco.');
prime('imperio', 'Guarda Imperial'); prime('imperio', 'Alistamento');
prime('necromante', 'Trabalhadores Zumbificado');
prime('piratas', 'Invasão Costeira'); prime('piratas', 'Atrás do Tesouro');
prepare('imperio,necromante,piratas');
assert(previews.length === 5, 'A mão padrão de cinco cartas não aparece durante alocação.');
check('factionIds.every(f=>flow.decks[f].hand.length===5)', 'Todas as facções devem receber cinco cartas inicialmente.');
const beforePreview = run('JSON.stringify({markers:flow.markers,decks:flow.decks})');
previews[0].onclick();
assert(run('JSON.stringify({markers:flow.markers,decks:flow.decks})') === beforePreview, 'Consulta da mão alterou cartas ou marcadores.');
// Tropa adicional apenas para exercitar o combate de duas unidades nesta simulação.
run('state.R5.units.piratas=2');
marker('imperio', 'R1'); marker('necromante', 'R4'); marker('piratas', 'R5'); confirmAll();
play('imperio', 'Alistamento', 0); click('executeAction');
play('necromante', 'Trabalhadores Zumbificado', 1); click('executeAction');
play('piratas', 'Atrás do Tesouro', 2); set('destination', 'R8'); set('quantity', 2); click('executeAction');
check('state.R8.units.piratas===2&&state.R1.units.imperio===5&&resources.necromante.madeira===2');
score(); click('nextRound');
prepare('piratas,imperio,necromante'); marker('piratas', 'R1'); marker('imperio', 'R2'); marker('necromante', 'R4'); confirmAll();
play('piratas', 'Invasão Costeira', 0); set('attackDefender', 'imperio'); set('move-R8', 2); click('prepareAttack');
check("battle&&battle.stage==='reaction'"); set('battleReaction', 'guard'); set('battleReactionMarker', run("flow.markers.findIndex(m=>m.f==='imperio'&&!m.used)"));
run("Math.random=(()=>{let a=[0.9,0.55,0,0];return ()=>a.shift()??0.2})()");
click('rollBattle'); click('applyBattle');
check("state.R1.units.imperio===2&&state.R1.units.piratas===1&&game.score.piratas===1&&flow.markers.some(m=>m.f==='imperio'&&m.used)", 'Resultado do combate, reação ou saque incorreto.');
score(); click('nextRound');
for (let round = 3; round <= 6; round++) { prepare('imperio,necromante,piratas'); confirmAll(); score(); click('nextRound'); }
check("flow.phase==='fim'&&game.score.necromante===6", 'Encerramento incorreto.');
click('reset'); check("flow.round===1&&flow.handSize===5&&state.R5.units.piratas===1&&state.R1.units.imperio===2&&state.R3.units.necromante===2&&state.R3.tower&&state.R4.extractor&&game.score.piratas===0", 'Reinício incorreto.');

// Visualização e escolhas no mapa: clicar não executa nem consome uma ação.
const imperialRegion = regions.find(r => r.innerHTML.includes('Praia Dourada'));
assert(imperialRegion && imperialRegion.innerHTML.includes('troop-dot') && imperialRegion.innerHTML.includes('domain-flag imperio'), 'Tropa ou marcador de domínio não exibido no mapa.');
check("(()=>{const s=clone(state.R5);s.units.piratas=15;return (troopDots(s).match(/troop-dot/g)||[]).length===12&&troopDots(s).includes('+3')})()", 'Agrupamento de tropas acima do limite visual incorreto.');
run("selected='R5';flow.phase='resolução';flow.order=['piratas','imperio','necromante'];flow.turn=0;flow.markers=[{f:'piratas',region:'R5',used:false}];flow.decks.piratas.hand=[{name:'Atrás do Tesouro',text:'Mover'}];renderFlow()");
play('piratas', 'Atrás do Tesouro', 0);
assert(run("mapChoice&&mapChoice.valid.includes('R9')"), 'Destinos de exploração não foram destacados.');
const invalidRegion = regions.find(r => r.innerHTML.includes('Praia Dourada'));
context.document.activeElement = invalidRegion;
invalidRegion.onclick();
check("!flow.markers[0].used&&selected==='R1'&&mapChoice.valid.includes('R9')", 'Inspeção de região inválida alterou a ação.');
assert(context.document.activeElement.attributes['data-region'] === 'R1', 'Foco da região não foi preservado após inspeção.');
const validRegion = regions.find(r => r.innerHTML.includes('Baixio Aberto'));
context.document.activeElement = validRegion;
validRegion.onclick();
assert(element('destination').value === 'R9', 'Destino não foi selecionado no painel.');
check("selected==='R9'&&!flow.markers[0].used", 'Escolha no mapa consumiu a ação.');
run("flow.phase='resolução';flow.order=['imperio','piratas','necromante'];flow.turn=0;flow.markers=[{f:'imperio',region:'R1',used:false}];flow.decks.imperio.hand=[{name:'Reorganizar Contingente',text:'Mover'}];renderFlow()");
play('imperio', 'Reorganizar Contingente', 0);
regions.find(r => r.innerHTML.includes('Praia dos Náufragos')).onclick();
assert(element('destination').value === 'R8', 'Clique no mapa não selecionou o destino.');
set('destination', 'R2'); element('destination').onchange();
check("selected==='R2'", 'Mudança no seletor não destacou o destino no mapa.');
regions.find(r => r.innerHTML.includes('Praia dos Náufragos')).onclick();
set('quantity', 1); click('executeAction');
check('state.R1.units.imperio===1&&state.R8.units.imperio===1&&flow.markers[0].used', 'Movimento guiado pelo mapa incorreto.');
run("state=initial();state.R7.units.piratas=2;state.R9.units.piratas=1;state.R5.units.piratas=0;flow.phase='resolução';flow.order=['piratas','imperio','necromante'];flow.turn=0;flow.markers=[{f:'piratas',region:'R1',used:false}];flow.decks.piratas.hand=[{name:'Invasão Costeira',text:'Atacar'}];renderFlow()");
play('piratas', 'Invasão Costeira', 0);
assert(run("mapChoice&&mapChoice.valid.includes('R7')&&!mapChoice.valid.includes('R9')"), 'Origem de ataque não foi destacada.');
regions.find(r => r.innerHTML.includes('Pico Partido')).onclick();
assert(element('move-R7').focused, 'Clique na origem de ataque não focou a quantidade.');
check('!flow.markers[0].used&&state.R7.units.piratas===2', 'Consulta da origem alterou a ação.');
click('reset'); prepare('imperio,necromante,piratas');
check("flow.allocationFaction==='necromante'", 'A alocação deve começar após o líder.');
set('markerRegion','R4');click('addMarker');
check("flow.allocationFaction==='piratas'&&flow.markers.length===1", 'A interface não avançou para a próxima facção.');
click('undoAllocation');
check("flow.allocationFaction==='necromante'&&flow.markers.length===0", 'Desfazer não restaurou a vez anterior.');
click('reset'); set('orderChoice', 'imperio'); set('handSize', 3); click('startRound'); set('imperialRecruit','R1');click('confirmImperialRecruit'); for (let i = 0; i < 3; i++) click('passBid');
check('flow.handSize===3&&factionIds.every(f=>flow.decks[f].hand.length===3)', 'O tamanho ajustável da mão deixou de funcionar.');
click('reset'); check('flow.handSize===5', 'Restaurar deve retornar ao padrão de cinco cartas.');

// Descartar usa um marcador, mesmo para uma carta reativa, e não compra outra.
run("flow.phase='resolução';flow.order=['necromante','piratas','imperio'];flow.turn=0;flow.markers=[{f:'necromante',region:'R4',used:false}];flow.decks.necromante.hand=[{name:'Praga Resistente',text:'Defesa'}];renderFlow()");
const drawBefore = run('flow.decks.necromante.draw.length');
play('necromante', 'Praga Resistente', 0); click('discardAction');
check("flow.markers[0].used&&flow.decks.necromante.hand.length===0&&flow.decks.necromante.discard.some(c=>c.name==='Praga Resistente')", 'Descarte não consumiu carta e marcador.');
assert(run('flow.decks.necromante.draw.length') === drawBefore, 'Descarte comprou uma carta.');
check("(()=>{try{refill('necromante');return false}catch(e){return true}})()", 'Compra fora da preparação foi permitida.');

// Invasão sem inimigo move tropas e resolve sem combate nem saque.
run("state=initial();flow.phase='resolução';flow.order=['piratas','imperio','necromante'];flow.turn=0;flow.markers=[{f:'piratas',region:'R8',used:false}];flow.decks.piratas.hand=[{name:'Invasão Costeira',text:'Mover'}];renderFlow()");
const goldBefore = run('resources.piratas.ouro');
play('piratas', 'Invasão Costeira', 0); set('move-R5', 1); set('attackDefender', 'imperio'); click('prepareAttack');
check("state.R8.units.piratas===1&&state.R5.units.piratas===0&&flow.markers[0].used&&!battle", 'Invasão em costa vazia não foi resolvida.');
assert(run('resources.piratas.ouro') === goldBefore, 'Invasão sem inimigo gerou saque.');

// Praga protege o primeiro dano e consome o marcador do defensor no resultado.
run("state=initial();state.R3.units.piratas=1;flow.phase='resolução';flow.order=['piratas','necromante','imperio'];flow.turn=0;flow.markers=[{f:'piratas',region:'R3',used:false},{f:'necromante',region:'R4',used:false}];flow.decks.piratas.hand=[{name:'Trabalhe enquanto eles dormem',text:'Saquear'}];flow.decks.necromante.hand=[{name:'Praga Resistente',text:'Defesa'}];renderFlow()");
play('piratas', 'Trabalhe enquanto eles dormem', 0); set('attackDefender', 'necromante'); click('prepareAttack');
check("battle&&battle.stage==='reaction'", 'Ataque local não iniciou combate.');
set('battleReaction', 'defense'); set('battleReactionMarker', 1);
run('Math.random=()=>0.55'); click('rollBattle');
check("battle.defProtection===1&&!flow.markers[1].used&&battle.result.defenderLoss===0", 'Praga não protegeu o primeiro dano.');
click('applyBattle');
check("flow.markers[1].used&&flow.decks.necromante.discard.some(c=>c.name==='Praga Resistente')", 'Reação não consumiu carta e marcador.');

// Retorno oferece somente as costas com menos tropas e mantém a escolha do jogador.
run("state=initial();for(const r of definitions)state[r.id].units.piratas=0;flow.phase='resolução';renderFlow()");
check("mapChoice.kind==='rescue'&&mapChoice.valid.includes('R8')&&mapChoice.valid.includes('R7')&&!mapChoice.valid.includes('R9')&&!mapChoice.valid.includes('R1')", 'Ilha à Vista não identificou costas elegíveis.');
set('rescueRegion', 'R8'); click('rescuePirate');
check('state.R8.units.piratas===1&&definitions.reduce((n,r)=>n+state[r.id].units.piratas,0)===1', 'Ilha à Vista não adicionou um único pirata.');

// Construção e transporte seguem as novas condições das cartas.
run("state=initial();resources=initialResources();executeCard('piratas','Taverna Pirata','R5',0)");
check("state.R5.bar&&resources.piratas.madeira===0", 'Taverna não foi construída sem custo adicional.');
run("state=initial();state.R5.units.imperio=1;resources.imperio.ouro=2");
set('other','imperio'); set('decision','yes'); set('price',1); set('transportOrigin','R2'); set('destination','R6'); set('quantity',1);
run("executeCard('piratas','Serviço de Transporte Pirata','R5',0)");
check("state.R2.units.imperio===0&&state.R6.units.imperio===1&&resources.piratas.ouro===1", 'Transporte não permitiu origem distinta e destino adjacente.');
// Um imposto por rodada: substituição, atraso e pagamento sem revelação imediata.
click('reset');
run("game.taxes=[{g:0,w:1,s:0,p:3},{g:1,w:0,s:0,p:2}]");
prepare('imperio,necromante,piratas');
check("game.tax.p===2&&game.taxes.length===1", 'Primeiro imposto não foi revelado.');
confirmAll(); score();
check('game.delay===1', 'Imposto não pago deve acumular atraso.');
click('nextRound'); prepare('imperio,necromante,piratas');
check('game.tax.p===3&&game.taxes.length===0&&game.delay===1', 'Novo imposto deve substituir o anterior preservando o atraso.');
run("resources.imperio.madeira=1;executeCard('imperio','Pagamento de Impostos','R1',0)");
check('game.tax===null&&game.taxPaid&&game.delay===0&&game.score.imperio===3', 'Pagamento deve encerrar o imposto e zerar o atraso sem revelar outro.');
confirmAll(); score();
check('game.delay===0', 'Rodada paga não deve acumular atraso.');
click('nextRound'); prepare('imperio,necromante,piratas');
check('game.tax===null', 'Baralho esgotado não deve gerar imposto.');
// O imposto aparece apenas na seleção ou na vez do Império.
click('reset');
assert(!element('flow').innerHTML.includes('class="tax-card"'), 'Imposto não deve aparecer na preparação.');
prepare('imperio,necromante,piratas');
assert(!element('flow').innerHTML.includes('class="tax-card"'), 'Imposto não deve aparecer na vez do Necromante.');
set('markerRegion','R4');click('addMarker');
assert(!element('flow').innerHTML.includes('class="tax-card"'), 'Imposto não deve aparecer na vez dos Piratas.');
set('markerRegion','R5');click('addMarker');
assert(element('flow').innerHTML.includes('class="tax-card"'), 'Imposto deve aparecer na vez de alocação do Império.');
marker('imperio','R1'); confirmAll();
assert(element('flow').innerHTML.includes('class="tax-card"'), 'Imposto deve aparecer na vez do Império.');
set('actionMarker',run("flow.markers.findIndex(m=>m.f==='imperio'&&!m.used)")); click('passAction');
assert(!element('flow').innerHTML.includes('class="tax-card"'), 'Imposto não deve aparecer na vez de outra facção.');
score();
assert(!element('flow').innerHTML.includes('class="tax-card"'), 'Imposto não deve aparecer na pontuação.');
// Construções imperiais: custos, pré-requisitos, pontuação e coleta.
click('reset');
run("resources.imperio={ouro:10,madeira:10};state.R6.units.imperio=1");
set('tech','Mercado Local');
check("(()=>{try{executeCard('imperio','O Progresso','R6',0);return false}catch(e){return true}})()", 'Mercado exige Serraria.');
set('tech','Serraria'); run("executeCard('imperio','O Progresso','R2',0)");
set('tech','Mercado Local'); run("executeCard('imperio','O Progresso','R6',0)");
check("state.R2.tech==='Serraria'&&state.R6.tech==='Mercado Local'&&game.score.imperio===2&&resources.imperio.madeira===8&&resources.imperio.ouro===9", 'Construções ou custos incorretos.');
set('extra',0);
run("flow.decks.imperio.hand=[{name:'Assegurar Recursos para o Rei'}];executeCard('imperio','Assegurar Recursos para o Rei','R1',0)");
check('resources.imperio.ouro===11', 'Mercado deve adicionar um Ouro à coleta.');
// Penalidade não remove recurso quando um tipo está zerado; desempate é escolhido.
run("state.R6.tech='Quartel';game.tax={g:1,w:0,s:0,p:2};game.delay=2;game.taxPaid=false;game.scored=0;flow.round=1;resources.imperio={ouro:2,madeira:0};scoreRound('R6')");
check("state.R6.tech===null&&resources.imperio.ouro===2&&game.delay===0", 'Penalidade com recurso zerado incorreta.');
run("state.R6.tech='Quartel';game.tax={g:1,w:0,s:0,p:2};game.delay=2;game.taxPaid=false;game.scored=0;resources.imperio={ouro:2,madeira:2};scoreRound('R6','madeira')");
check('resources.imperio.ouro===2&&resources.imperio.madeira===1', 'Penalidade deve respeitar escolha em empate.');
// Salão troca o imposto sem consumir marcador e uma vez por rodada.
run("state.R6.tech='Salão Imperial';game.tax={g:1,w:0,s:0,p:2};game.taxes=[{g:0,w:1,s:0,p:3},{g:1,w:1,s:0,p:4}];game.taxPaid=false;game.hallUsedRound=0;flow.phase='resolução';flow.order=['imperio','piratas','necromante'];flow.turn=0;flow.markers=[{f:'imperio',region:'R1',used:false}];renderFlow()");
set('hallResource','ouro'); click('hallChange');
check('game.tax.p===4&&game.hallUsedRound===flow.round&&resources.imperio.ouro===1&&!flow.markers[0].used', 'Salão não trocou imposto corretamente.');
assert(!element('flow').innerHTML.includes('id="hallChange"'), 'Salão não pode ser usado duas vezes na rodada.');
// Fortaleza oferece uma única nova rolagem de um dado de qualquer tipo.
run("state=initial();state.R2.tech='Fortaleza';state.R1.units.piratas=3;flow.phase='resolução';flow.order=['imperio','piratas','necromante'];flow.turn=0;flow.markers=[{f:'imperio',region:'R1',used:false}];flow.decks.imperio.hand=[{name:'Marcha Imperial',text:'Atacar'}];renderFlow()");
play('imperio','Marcha Imperial',0); set('attackDefender','piratas'); set('move-R2',0); click('prepareAttack'); set('battleReaction','none');
run('Math.random=()=>0'); click('rollBattle');
assert(element('cardDetail').innerHTML.includes('id="rerollBattle"'), 'Fortaleza não ofereceu rerrolagem.');
set('rerollDie','d0'); run('Math.random=()=>0.99'); click('rerollBattle');
check('battle.rerolled&&battle.defenseDice[0][0]===1&&battle.defenseDice[0][1]===1', 'Rerrolagem do dado de defesa incorreta.');
assert(!element('cardDetail').innerHTML.includes('id="rerollBattle"'), 'Fortaleza permitiu nova rerrolagem.');
// Guarda com Quartel controlado e acordo acima do antigo limite.
run("battle=null;state=initial();state.R2.tech='Quartel';state.R1.units.piratas=1;flow.phase='resolução';flow.order=['piratas','imperio','necromante'];flow.turn=0;flow.markers=[{f:'piratas',region:'R1',used:false},{f:'imperio',region:'R2',used:false}];flow.decks.piratas.hand=[{name:'Trabalhe enquanto eles dormem',text:'Atacar'}];flow.decks.imperio.hand=[{name:'Guarda Imperial',text:'Defesa'}];renderFlow()");
play('piratas','Trabalhe enquanto eles dormem',0); set('attackDefender','imperio'); click('prepareAttack'); set('battleReaction','guard'); set('battleReactionMarker',1); click('rollBattle');
check('battle.defProtection===2', 'Quartel controlado deve ampliar a Guarda.');
run("battle=null;state=initial();state.R1.units.piratas=1;resources=initialResources();resources.imperio.ouro=5;resources.piratas.madeira=5");
set('other','piratas'); set('decision','yes'); set('giveType','ouro'); set('takeType','madeira'); set('give',4); set('take',4);
run("executeCard('imperio','Aliança com o Império','R1',0)");
check('resources.imperio.ouro===1&&resources.imperio.madeira===4&&resources.piratas.madeira===1', 'Aliança deve permitir troca acima de dois recursos.');
// Cartas que descartam a mão recompram cinco, sem depender do tamanho configurado.
for (const [f, name, region] of [['piratas','Novas Comandante a Bordo','R5'],['necromante','Remanejando Mortos','R3'],['necromante','Monumento a Morte','R3']]) {
  click('reset');
  run(`flow.phase='resolução';flow.handSize=3;flow.order=[${JSON.stringify(f)},...factionIds.filter(x=>x!==${JSON.stringify(f)})];flow.turn=0;flow.markers=[{f:${JSON.stringify(f)},region:${JSON.stringify(region)},used:false}];flow.decks[${JSON.stringify(f)}]={hand:[{name:${JSON.stringify(name)},text:'Efeito'},{name:'Descartada',text:''}],draw:Array.from({length:6},(_,i)=>({name:'Nova '+i,text:''})),discard:[]};renderFlow()`);
  play(f,name,0); if (name==='Remanejando Mortos') set('destination','R4'); click('executeAction');
  check(`flow.decks[${JSON.stringify(f)}].hand.length===5&&flow.decks[${JSON.stringify(f)}].hand.every(c=>c.name.startsWith('Nova '))&&flow.decks[${JSON.stringify(f)}].discard.length===2&&flow.markers[0].used`, 'Descarte e compra incorretos: '+name);
}
// Se o monte terminar, o descarte pode ser reembaralhado, sem inventar cartas.
run("flow.phase='resolução';flow.order=['piratas','imperio','necromante'];flow.turn=0;flow.markers=[{f:'piratas',region:'R5',used:false}];flow.decks.piratas={hand:[{name:'Novas Comandante a Bordo',text:''},{name:'Antiga',text:''}],draw:[{name:'Nova',text:''}],discard:[]};renderFlow()");
play('piratas','Novas Comandante a Bordo',0); click('executeAction');
check('flow.decks.piratas.hand.length===3&&flow.decks.piratas.draw.length===0&&flow.decks.piratas.discard.length===0', 'Reembaralhamento ou falta de cartas incorretos.');
console.log('OK: documentação, dados, mapa, domínio, combate, saque e partida simulada de seis rodadas.');
console.log('Limite: DOM substituto e dados controlados; não verifica apresentação visual nem todas as regras.');

undefined
