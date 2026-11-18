'use strict';
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const url = pathToFileURL(path.resolve(__dirname, '../../mapa-fluxo-dinamico.html')).href;

test('evento manual ignora condição e mantém efeitos até reiniciar', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await expect(page.getByRole('button', { name: 'Testar evento' })).toHaveCount(0);
  await page.evaluate(() => { flow.phase = 'pontuação'; renderFlow(); });
  await expect(page.locator('#phaseDialog')).toBeVisible();
  await page.locator('#abrirEventosPontuacao').click();
  await page.locator('#eventoEscolha').selectOption('escassez');
  await page.locator('#executarEvento').click();
  await expect(page.locator('#eventoDialog')).toContainText('condição foi ignorada');
  await page.locator('#aplicarEvento').click();
  expect(await page.evaluate(() => [recursoEvento(byId('R1')), recursoEvento(byId('R11')), game.eventPending])).toEqual(['Sem recurso', 'Ouro', false]);
  expect(errors).toEqual([]);
});

test('marco revela evento somente na pontuação', async ({ page }) => {
  await page.goto(url);
  await page.evaluate(() => { flow.phase = 'resolução'; game.score.elfos = 9; game.eventDeck = ['fome', 'guerra']; addPoints('elfos', 1, 'teste'); renderFlow(); });
  await expect(page.locator('#eventoDialog')).toBeHidden();
  await page.evaluate(() => beginScoring());
  await expect(page.locator('#eventoDialog')).toBeVisible();
  await expect(page.locator('#eventoDialog')).toContainText('A Grande Fome');
  await page.locator('#aplicarEvento').click();
  expect(await page.evaluate(() => [game.eventPending, game.eventDiscard.join(','), state.R1.units.imperio])).toEqual([false, 'fome', 0]);
});
