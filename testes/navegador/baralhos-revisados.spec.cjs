'use strict';
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const url = pathToFileURL(path.resolve(__dirname, '../../mapa-baralhos-revisados.html')).href;

test('variante local prepara modo, limpa seleção e resolve combate com reações', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/^https?:/, route => route.abort());
  await page.goto(url);
  await expect(page).toHaveTitle(/baralhos revisados/);
  await page.locator('#orderChoice').selectOption('imperio');
  await page.locator('#startRound').click();
  if (await page.locator('#confirmImperialRecruit').isVisible()) {
    await page.locator('#imperialRecruit').selectOption('R1');
    await page.locator('#confirmImperialRecruit').click();
  }
  for (let i = 0; i < 4; i++) await page.locator('#passBid').click();
  await page.evaluate(() => {
    flow.decks.imperio.hand = [{name:'Ordens da Coroa',text:'Escolha um modo.',leadership:1},{name:'Marcha Imperial',text:'Marcha.',leadership:2}];
    renderFlow();
  });
  await page.locator('#handArea [data-card-index="1"]').click();
  await page.locator('[data-mode="0"]').click();
  await page.locator('[data-region="R4"]').click();
  expect(await page.evaluate(() => !!mapChoice)).toBe(true);
  await page.locator('#handArea [data-card-index="0"]').click();
  expect(await page.evaluate(() => mapChoice)).toBeNull();
  await expect(page.locator('#cardDetail')).toContainText('Pagar imposto');
  await page.locator('[data-mode="1"]').click();
  await page.locator('[data-region="R1"]').click();
  await expect(page.locator('#cardDetail')).toContainText('Pagamento de Impostos');
  await page.locator('#map').click({position:{x:5,y:5}});
  await expect(page.locator('#cardDetail')).toBeEmpty();
  expect(await page.evaluate(() => flow.markers.filter(m => m.used).length)).toBe(0);
  await page.evaluate(() => {
    state=initial(); resources=initialResources(); game=newGame(); flow=newFlow();
    flow.phase='resolução'; flow.order=['piratas','imperio','necromante','elfos'];
    flow.markers=[{f:'piratas',region:'R5',used:false},{f:'piratas',region:null,used:false},{f:'imperio',region:null,used:false},{f:'elfos',region:null,used:false}];
    flow.decks.piratas.hand=[{name:'Invasão Costeira'},{name:'Vento a Favor'}];
    flow.decks.imperio.hand=[{name:'Guarda Imperial'}];
    flow.decks.elfos.hand=[{name:'Trilhas na Mata / Defesa Global'}];
    state.R5.units.piratas=1; state.R5.units.imperio=2;
    battle={f:'piratas',defender:'imperio',region:'R5',ci:0,mi:0,card:'Invasão Costeira',physicalCard:'Invasão Costeira',modeLabel:'Saquear',stage:'reaction'};
    Math.random=()=>0.99; renderBattle();
  });
  await page.locator('#suppressDefense').click();
  await page.locator('#useDefense').click();
  await page.locator('#protectDefender').click();
  await page.locator('#rollBattle').click();
  expect(await page.evaluate(() => ({dice:battle.defenseDice.length, protection:battle.defProtection}))).toEqual({dice:0,protection:2});
  await page.locator('#applyBattle').click();
  expect(await page.evaluate(() => ({turn:flow.turn, used:flow.markers.filter(m=>m.used).length, log:flow.log.join(' ')}))).toMatchObject({turn:1,used:4,log:expect.stringContaining('Saquear')});
  expect(errors).toEqual([]);
});
