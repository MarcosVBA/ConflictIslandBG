'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../prototipo/mesa-conceito.html'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script, 'Demonstração deve conter script local.');
assert(!/<(?:script|link|img)\b[^>]*(?:src|href)\s*=/i.test(source), 'Demonstração deve abrir sem dependências externas.');
class Element {
 constructor(id='') { this.id=id;this.hidden=false;this.style={setProperty(){}};this.dataset={};this.attributes={};this.children=[];this._html='';this.textContent='';this.classList={add(){},remove(){}}; }
 set innerHTML(value) { this._html=value; }
 get innerHTML() { return this._html; }
 setAttribute(k,v) { this.attributes[k]=String(v); }
 getAttribute(k) { return this.attributes[k]||null; }
 getBoundingClientRect() { if(this.id==='map')return {left:0,top:0,width:1000,height:600};const x=parseFloat(this.style.left)*10,y=parseFloat(this.style.top)*6;return {left:x-75,right:x+75,top:y-49,bottom:y+49,width:150,height:98}; }
 appendChild(c) { this.children.push(c); }
 remove() { const i=map.children.indexOf(this);if(i>=0)map.children.splice(i,1); }
 focus() { document.activeElement=this; }
 querySelectorAll(selector) {
  if(selector==='.region')return this.children.filter(c=>String(c.className||'').includes('region'));
  const key=selector.match(/^\[data-(screen|faction|card|go|first)\]$/)?.[1];
  if(key) return [...this._html.matchAll(new RegExp(`data-${key}="([^"]+)"`,'g'))].map(m=>{const e=new Element();e.dataset[key]=m[1];return e});
  if(selector==='.die')return Array.from({length:3},()=>new Element());
  return [];
 }
 querySelector(selector) { if(selector==='.modal-close'||selector==='.result')return new Element();return null; }
}
const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id)};
const map=get('map'),overlay=get('overlay');overlay.hidden=true;
const listeners={};const document={getElementById:get,createElement:()=>new Element(),documentElement:new Element(),activeElement:null,contains:()=>true,addEventListener:(name,fn)=>{listeners[name]=fn},fullscreenElement:null};
const context={document,Math,clearTimeout(){},setTimeout(){return 1},console};vm.createContext(context);vm.runInContext(script,context);
const run=code=>vm.runInContext(code,context);
assert.equal(map.children.length,10);
assert.equal(run('edges.length'),16);
const principal = fs.readFileSync(path.join(__dirname, '../mapa-fluxo-dinamico.html'), 'utf8');
assert.equal(source.match(/const edges=\[[^\n]+/)[0], principal.match(/const edges=\[[^\n]+/)[0], 'O mapa visual deve usar as conexões do protótipo jogável.');
assert.equal((get('connections').innerHTML.match(/<path /g)||[]).length,16,'Todas as conexões devem estar visíveis.');
assert.equal((get('connections').innerHTML.match(/class="connection-active"/g)||[]).length,0);
assert.equal(run("edges.some(([a,b])=>[a,b].includes('R3')&&[a,b].includes('R7'))"),false);
assert.equal(run("edges.some(([a,b])=>[a,b].includes('R9')&&[a,b].includes('R11'))"),false);
assert.equal(run("edges.some(([a,b])=>[a,b].includes('R1')&&[a,b].includes('R9'))"),false);
assert.equal(run("edges.some(([a,b])=>[a,b].includes('R7')&&[a,b].includes('R9'))"),false);
assert.equal(run("edges.some(([a,b])=>[a,b].includes('R6')&&[a,b].includes('R8'))"),false);
assert.equal(run("edges.some(([a,b])=>[a,b].includes('R7')&&[a,b].includes('R11'))"),true);
const region = id => map.children.find(e=>e.attributes['aria-label'].startsWith(id+','));
assert.equal((region('R1').innerHTML.match(/class="meeple"/g)||[]).length,2,'Cada soldado imperial deve ter uma peça.');
assert.equal((region('R10').innerHTML.match(/class="meeple"/g)||[]).length,2,'Cada unidade élfica deve ter uma peça.');
assert(region('R1').innerHTML.includes(factionColor('imperio')) && region('R10').innerHTML.includes(factionColor('elfos')),'As peças usam as cores das facções.');
function factionColor(id){return run(`factions.${id}.color`)}
assert(region('R3').innerHTML.includes('building-token') && region('R3').attributes['aria-label'].includes('Torre Esquecida de Necromante'));
assert(region('R4').innerHTML.includes('building-token') && region('R4').attributes['aria-label'].includes('Extrator de Necromante'));
assert(region('R3').innerHTML.includes(factionColor('necromante')) && region('R4').innerHTML.includes(factionColor('necromante')),'Construções usam a cor de sua facção.');
assert(region('R11').innerHTML.includes('title="Ouro"'));
assert(region('R10').innerHTML.includes('title="Madeira"') && !region('R7').innerHTML.includes('resource-token'));

assert.equal(run('screens.length'),8);
assert.equal(run("factions[active].hand.length"),5);
assert(get('factions').innerHTML.includes('Sua vez'));
assert(get('factionInfo').innerHTML.includes('Imposto ativo') && get('factionInfo').innerHTML.includes('Serraria') && get('factionInfo').innerHTML.includes('1 de 3 rodadas'));
run("active='necromante';drawFactions()");assert(get('factionInfo').innerHTML.includes('Regiões devastadas'));
run("active='piratas';drawFactions()");assert(get('factionInfo').innerHTML.includes('Bares construídos'));
run("active='elfos';drawFactions();drawHand()");
assert(get('factions').innerHTML.includes('Elfos'));
assert(get('factionInfo').innerHTML.includes('Florestas dominadas') && !get('factionInfo').innerHTML.includes('Imposto ativo'));
assert(get('hand').innerHTML.includes('Canção de paz'));
map.children.find(e=>e.attributes['aria-label'].startsWith('R10,')).onclick();
assert.equal(run('selectedRegion'),'R10');
assert(get('mapHint').textContent.includes('R6') && !get('mapHint').textContent.includes('R3'));
const neighbor=map.children.find(e=>e.getAttribute('data-region-id')==='R6');
assert(neighbor.className.includes('neighbor'));
assert.equal((get('connections').innerHTML.match(/<path /g)||[]).length,16,'Todas as conexões permanecem visíveis ao selecionar.');
const highlighted=[...get('connections').innerHTML.matchAll(/data-edge="([^"]+)" class="connection-active"/g)].map(m=>m[1]).sort();
assert.deepEqual(highlighted,['R10-R11','R10-R6','R10-R8','R2-R10']);
for(const id of ['inicio','lideranca','acao','reacao','dados','pontuacao','fim']){
 run(`showScreen('${id}')`);assert.equal(overlay.hidden,false,`Tela ausente: ${id}`);assert(get('modal').innerHTML.includes('modalTitle'),`Título ausente: ${id}`);
}
run("showScreen('dados')");assert(get('modal').innerHTML.includes('⚔')&&get('modal').innerHTML.includes('✚'));
run("showScreen('mesa')");assert.equal(overlay.hidden,true);
assert.equal(typeof get('fullscreen').onclick,'function');
console.log('Mesa conceitual: 10 regiões, quatro facções, mão, oito telas e controles principais verificados em DOM substituto.');
