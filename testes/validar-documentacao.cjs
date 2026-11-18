'use strict';

// Verifica dados documentados e comportamento essencial sem navegador ou dependências.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('mapa-fluxo-dinamico.html');
const elements = new Map();
let cards = [], previews = [], regions = [], checkedBuildings = [];
const classes = () => ({ add() {}, remove() {}, toggle() {} });
function createCard(index, kind) {
  return { dataset: { [kind === 'preview' ? 'previewIndex' : 'cardIndex']: index }, classList: classes(), disabled: false, attributes: {}, setAttribute(k,v) { this.attributes[k]=String(v); } };
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
        previews = [...v.matchAll(/data-preview-index="(\d+)"/g)].map(x => createCard(x[1], 'preview'));
      }
      if (this.id === 'handArea') cards = [...v.matchAll(/data-card-index="(\d+)"/g)].map(x => createCard(x[1], 'card'));
    },
    attributes: {}, setAttribute(k, v) { this.attributes[k] = String(v); }, scrollBy() {},
    focus() { this.focused = true; context.document.activeElement = this; },
    querySelector(q) {
      const match = q.match(/^\[data-region="(R\d+)"\]$/);
      return this.id === 'map' && match ? regions.find(x => x.attributes['data-region'] === match[1]) || null : null;
    },
    querySelectorAll(q) {
      if (this.id === 'handArea' && q === '[data-card-index]') return cards;
      if (this.id === 'flow' && q === '[data-preview-index]') return previews;
      if (this.id === 'map' && q === '.region') return regions;
      if (q === '.destroyBuilding:checked') return checkedBuildings;
      return [];
    },
    appendChild(x) { if (this.id === 'map') regions.push(x); },
    prepend() {},
    remove() { regions = regions.filter(x => x !== this); },
  };
  elements.set(id, e);
  return e;
}
const context = { document: { body: element("body"), addEventListener() {}, getElementById: element, createElement: () => element(Math.random()) }, window: { matchMedia: () => ({ matches: true }) } };
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
assert(element('fullscreen').attributes['aria-label']==='Entrar em tela cheia','Controle de tela cheia ausente.');
assert((element('lines').innerHTML.match(/<path /g)||[]).length===16,'Todas as conexões devem estar presentes.');
assert((element('lines').innerHTML.match(/class="selected-connection"/g)||[]).length===2,'Conexões da região inicial devem estar destacadas.');
run("visualAssets.cartas['Marcha Imperial']='artes/marcha.webp';visualAssets.regioes.R1='artes/praia.webp';render()");
assert(run("handCard('imperio',{name:'Marcha Imperial',text:'',leadership:1},0,1).includes('src=\"artes/marcha.webp\"')"),'Arte opcional da carta não foi aplicada.');
assert(regions.find(r=>r.attributes['data-region']==='R1').style.backgroundImage.includes('artes/praia.webp'),'Arte opcional da região não foi aplicada.');
run("delete visualAssets.cartas['Marcha Imperial'];delete visualAssets.regioes.R1;render()");
const modules = ['README.md','regras/regras-gerais.md','regras/combate.md','regras/dados.md','regras/mapa.md','regras/pontuacao.md','faccoes/piratas.md','faccoes/necromante.md','faccoes/imperio.md','faccoes/elfos.md','faccoes/dragoes.md','ideias/eventos.md','ideias/pontuacao.md','ideias/tensao-madeira.md'];
for (const file of modules) for (const match of read(file).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
  const href = match[1].split('#')[0];
  if (href && !/^[a-z]+:/i.test(href)) {
    const target = path.resolve(root, path.dirname(file), decodeURIComponent(href));
    if (target !== path.join(root, 'historico') && !target.startsWith(path.join(root, 'historico') + path.sep)) {
      assert(fs.existsSync(target), `Link quebrado em ${file}: ${href}`);
    }
  }
}
for (const faction of ['piratas','necromante','imperio','elfos']) {
  const content = read(`faccoes/${faction}.md`).split('## Baralho vigente')[1]?.split('\n## ')[0];
  assert(content, `Baralho ausente: ${faction}`);
  const rows = [...content.matchAll(/^\|\s*\*\*(.*?)\*\*\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm)].map(m=>[m[1],Number(m[2]),Number(m[3])]);
  assert(JSON.stringify(rows) === run(`JSON.stringify(cardDefs.${faction}.map(([name,count])=>[name,count,leadershipValues[name]]))`), `Baralho ou liderança divergente: ${faction}`);
  assert(rows.reduce((sum,row)=>sum+row[1],0)===12, `Quantidade divergente: ${faction}`);
}
const mapText=read('regras/mapa.md');
const rows=[...mapText.matchAll(/^\|\s*(R\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(Sim|Não)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm)];
const defs=JSON.parse(run('JSON.stringify(definitions)'));
assert(rows.length===defs.length && defs.length===10, 'Quantidade de regiões divergente.');
for(const row of rows){
 const [,id,name,terrain,coast,resource,start]=row, r=defs.find(x=>x.id===id);
 assert(r && r.name===name.trim() && r.terrain===terrain.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'') && r.coast===(coast==='Sim') && r.resource===(resource.trim()==='Nenhum'?'Sem recurso':resource.trim()), `Região divergente: ${id}`);
 const initialState=JSON.parse(run(`JSON.stringify(state[${JSON.stringify(id)}])`));
 const initial=start.trim().match(/^(Império|Necromante|Piratas|Elfos):\s*(\d+)/);
 const faction=initial && {'Império':'imperio','Necromante':'necromante','Piratas':'piratas','Elfos':'elfos'}[initial[1]];
 assert(initial || start.trim()==='Livre', `Início desconhecido: ${id}`);
 assert(initialState.owner===(faction||'livre'), `Domínio inicial divergente: ${id}`);
 for(const f of ['imperio','necromante','piratas','elfos']) assert(initialState.units[f]===(f===faction?Number(initial[2]):0), `Tropas iniciais divergentes: ${id}/${f}`);
 assert(initialState.tower===/\bTorre\b/.test(start) && initialState.extractor===/extrator/i.test(start), `Construção inicial divergente: ${id}`);
}
const documentedEdges=[...mapText.matchAll(/\b(R\d+)-(R\d+)\b/g)].map(m=>[m[1],m[2]].sort().join('-')).sort();
const actualEdges=JSON.parse(run('JSON.stringify(edges)')).map(e=>e.sort().join('-')).sort();
assert(JSON.stringify(documentedEdges)===JSON.stringify(actualEdges),'Conexões divergentes.');
const faceMap={'Vazia':[0,0],'Uma espada':[1,0],'Uma cruz':[0,1],'Duas cruzes':[0,2],'Uma espada e uma cruz':[1,1],'Duas espadas e uma cruz':[2,1]};
const faces=[[],[]];
for(const [,name,a,d] of read('regras/dados.md').matchAll(/^\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm)){
 assert(faceMap[name.trim()],`Face desconhecida: ${name}`);for(let i=0;i<Number(a);i++)faces[0].push(faceMap[name.trim()].join(','));for(let i=0;i<Number(d);i++)faces[1].push(faceMap[name.trim()].join(','));
}
const actualFaces=JSON.parse(run('JSON.stringify([attackFaces,defenseFaces])'));
for(let i=0;i<2;i++)assert(JSON.stringify(faces[i].sort())===JSON.stringify(actualFaces[i].map(x=>x.join(',')).sort()),'Dados divergentes.');
assert(!/<(?:script|link|img)\b[^>]*(?:src|href)\s*=/i.test(html.replace(/<script>[\s\S]*?<\/script>/g,'')),'O HTML principal precisa funcionar sem arquivos externos obrigatórios.');
check("resources.imperio.ouro===1&&resources.necromante.madeira===1&&resources.piratas.ouro===0&&resources.elfos.ouro===0&&resources.elfos.madeira===0");
console.log('OK: links, quatro baralhos e liderança, 10 regiões, conexões, dados e HTML local.');
console.log('Limite: DOM substituto; não verifica apresentação visual nem interpreta toda a prosa.');
