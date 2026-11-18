'use strict';
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const url = pathToFileURL(path.resolve(__dirname, '../../mapa-fluxo-dinamico.html')).href;

test('minimiza e retoma preparação preservando escolhas', async ({ page }) => {
  await page.goto(url);
  await page.locator('#orderChoice').selectOption('elfos');
  await page.locator('#phaseDialog .minimize-modal').click();
  await expect(page.locator('#phaseDialog')).toBeHidden();
  await expect(page.locator('#resumeModal')).toBeVisible();
  await page.locator('#resumeModal').click();
  await expect(page.locator('#phaseDialog')).toBeVisible();
  await expect(page.locator('#orderChoice')).toHaveValue('elfos');
});

test('retoma janelas aninhadas e preserva a escolha de evento', async ({ page }) => {
  await page.goto(url);
  await page.evaluate(() => { flow.phase = 'pontuação'; renderFlow(); });
  await page.locator('#abrirEventosPontuacao').click();
  await page.locator('#eventoEscolha').selectOption('escassez');
  await page.locator('#eventoEscolhaDialog .minimize-modal').click();
  await expect(page.locator('#phaseDialog')).toBeHidden();
  await expect(page.locator('#eventoEscolhaDialog')).toBeHidden();
  await page.locator('#resumeModal').click();
  await expect(page.locator('#phaseDialog')).toBeVisible();
  await expect(page.locator('#eventoEscolhaDialog')).toBeVisible();
  await expect(page.locator('#eventoEscolha')).toHaveValue('escassez');
});

test('minimiza ação sem perder formulário', async ({ page }) => {
  await page.goto(url);
  await page.evaluate(() => { flow.phase = 'resolução'; renderFlow(); document.querySelector('#dialogContent').innerHTML = '<label>Escolha <input id="valorTeste" value="antes"></label>'; openActionDialog(false); });
  await page.locator('#valorTeste').fill('mantido');
  await page.locator('#actionDialog .minimize-modal').click();
  await page.locator('#resumeModal').click();
  await expect(page.locator('#valorTeste')).toHaveValue('mantido');
});
