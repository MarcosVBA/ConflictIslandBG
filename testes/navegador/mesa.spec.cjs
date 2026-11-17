'use strict';
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { configurarCenario } = require('./cenarios.cjs');
const url = pathToFileURL(path.resolve(__dirname, '../../mapa-fluxo-dinamico.html')).href;

async function abrir(page) {
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  page.on('requestfailed', r => erros.push(`${r.url()}: ${r.failure()?.errorText}`));
  await page.route(/^https?:/, route => route.abort('blockedbyclient'));
  await page.addInitScript(() => { let seed=12345; Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646; });
  await page.goto(url);
  expect(new URL(page.url()).protocol).toBe('file:');
  return erros;
}
async function evidencia(page, info, nome) {
  const imagem = info.outputPath(`${nome}.png`);
  await page.screenshot({ path: imagem, fullPage: true, animations: 'disabled' });
  await info.attach(nome, { path: imagem, contentType: 'image/png' });
  // Comparações só são habilitadas quando houver uma referência revisada.
  if (process.env.VISUAL_CHECK === '1') await expect(page).toHaveScreenshot(`${nome}.png`, { fullPage: true, animations: 'disabled' });
}
async function preparar(page) {
  await page.locator('#orderChoice').selectOption('imperio');
  await page.locator('#startRound').click();
  if (await page.locator('#confirmImperialRecruit').isVisible()) {
    await page.locator('#imperialRecruit').selectOption('R1');
    await page.locator('#confirmImperialRecruit').click();
  }
  for (let i=0; i<4; i++) await page.locator('#passBid').click();
}

test('abre offline, mostra o mapa e permite selecionar regiões por teclado', async ({ page }, info) => {
  const erros = await abrir(page);
  await expect(page.locator('.region')).toHaveCount(11);
  await expect(page.locator('#lines path, #lines line')).not.toHaveCount(0);
  const regiao=page.locator('[data-region="R10"]');
  await regiao.focus();
  await expect(regiao).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#details')).toContainText('R10');
  await evidencia(page,info,'mapa-inicial');
  expect(erros).toEqual([]);
});

test('detalhes da região sobre o mapa podem ser ocultados sem afetar as conexões', async ({ page }, info) => {
  const erros = await abrir(page);
  const infoRegiao = page.locator('#regionInfo');
  const toggle = page.locator('#toggleRegionInfo');
  await expect(infoRegiao).toBeHidden();
  await expect(toggle).toHaveText('Mostrar informações das regiões');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(infoRegiao).toBeVisible();
  await expect(toggle).toHaveText('Ocultar informações das regiões');
  await expect(infoRegiao).toHaveCSS('pointer-events', 'none');
  await expect(page.locator('#toggle')).toHaveCount(0);
  await expect(page.locator('#lines path')).toHaveCount(18);
  await evidencia(page, info, 'informacoes-sobre-mapa');
  await toggle.click();
  await expect(infoRegiao).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.locator('[data-region="R9"]').click();
  await expect(page.locator('#lines path')).toHaveCount(18);
  await toggle.click();
  await expect(infoRegiao).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(infoRegiao).toContainText('R9');
  expect(erros).toEqual([]);
});

test('regiões mostram meeples, construções e recursos coloridos e identificáveis', async ({ page }) => {
  const erros = await abrir(page);
  const torre = page.locator('[data-region="R3"]');
  await expect(torre.locator('.region-id')).toContainText('R3');
  await expect(torre.locator('.troop-group.necromante .troop-meeple')).toHaveCount(2);
  await expect(torre.locator('.building-icon.necromante')).toHaveCount(1);
  await expect(torre.locator('.resource-token.gold')).toHaveCount(1);
  await expect(page.locator('[data-region="R2"] .resource-token.wood')).toHaveCount(1);
  const dimensions = await torre.evaluate(el => {
    const size = selector => { const rect=el.querySelector(selector).getBoundingClientRect(); return [rect.width,rect.height] };
    return {meeple:size('.troop-meeple'), construcao:size('.building-icon'), recurso:size('.resource-token')};
  });
  expect(dimensions.meeple).toEqual([18,21]);
  expect(dimensions.construcao).toEqual([34,34]);
  expect(dimensions.recurso).toEqual([18,18]);
  await expect(torre).toHaveAttribute('aria-label', /Necromante 2/);
  expect(erros).toEqual([]);
});

test('oferece uma carta no leilão de liderança', async ({ page }) => {
  const erros=await abrir(page);
  await page.locator('#orderChoice').selectOption('imperio');
  await page.locator('#startRound').click();
  if (await page.locator('#confirmImperialRecruit').isVisible()) {
    await page.locator('#imperialRecruit').selectOption('R1');
    await page.locator('#confirmImperialRecruit').click();
  }
  await page.evaluate(() => { flow.decks.imperio.hand=[{name:'Marcha Imperial',text:'Atacar',leadership:1}];renderFlow(); });
  await page.locator('#handArea [data-card-index="0"]').click();
  await expect(page.locator('#bid-0')).toBeChecked();
  await page.locator('#submitBid').click();
  for (let i=0;i<3;i++) await page.locator('#passBid').click();
  await expect(page.locator('#flow')).toContainText('Vez: Império');
  expect(await page.evaluate(() => flow.decks.imperio.discard.some(c=>c.name==='Marcha Imperial'))).toBe(true);
  expect(erros).toEqual([]);
});

test('leilão, ações das quatro facções e próxima rodada', async ({ page }, info) => {
  const erros=await abrir(page);
  await preparar(page);
  // Mãos fixas tornam o percurso reproduzível; os efeitos são executados pela interface.
  await configurarCenario(page, 'rodada');
  for(const [f,region] of [['imperio','R1'],['necromante','R4'],['piratas','R5'],['elfos','R10']]) {
    await expect(page.locator('#handArea')).toHaveAttribute('data-faction',f);
    await page.locator(`[data-region="${region}"]`).click();
    await page.locator('#handArea [data-card-index="0"]').click();
    await evidencia(page,info,`mao-${f}`);
    await page.locator('#executeAction').click();
  }
  const resultado=await page.evaluate(() => ({i:state.R1.units.imperio,n:resources.necromante.madeira,p:state.R5.units.piratas,e:resources.elfos.madeira}));
  expect(resultado).toEqual({i:5,n:2,p:2,e:2});
  for(let i=0;i<4;i++) await page.locator('#passAction').click();
  await page.locator('#toScore').click();
  await expect(page.locator('#nextRound')).toBeVisible();
  await page.locator('#nextRound').click();
  await expect(page.locator('#flow')).toContainText('Rodada 2');
  expect(erros).toEqual([]);
});

test('combate apresenta reações, dados e resultado', async ({ page }, info) => {
  const erros=await abrir(page);
  await preparar(page);
  await configurarCenario(page, 'combate');
  await page.locator('[data-region="R4"]').click();
  await page.locator('#handArea [data-card-index="0"]').click();
  await page.locator('#attackDefender').selectOption('necromante');
  await page.locator('#move-R2').fill('1');
  await page.locator('#prepareAttack').click();
  await expect(page.locator('#actionDialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#actionDialog')).toBeVisible();
  await page.locator('#skipDefense').click();
  await page.locator('#skipPeace').click();
  await page.locator('#rollBattle').click();
  await expect(page.locator('.game-die').first()).toBeVisible();
  await evidencia(page,info,'dados-combate');
  await page.locator('#applyBattle').click();
  await expect(page.locator('#flow')).toContainText('Vez: Necromante');
  expect(erros).toEqual([]);
});

test('ação sem mapa abre modal e pode ser cancelada sem gastar a carta', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  await page.evaluate(() => {
    flow.turn=2;
    flow.decks.piratas.hand=[{name:'Novas Comandante a Bordo',text:'Compre novas cartas',leadership:0},{name:'Pirata Aprendiz',text:'Recrutar',leadership:1}];
    renderFlow();
  });
  await page.locator('#handArea [data-card-index="0"]').click();
  await expect(page.locator('#actionDialog')).toBeVisible();
  await expect(page.locator('#dialogContent')).not.toContainText('Região da ação');
  await page.locator('#cancelActionDialog').click();
  await expect(page.locator('#actionDialog')).toBeHidden();
  expect(await page.evaluate(() => ({cards:flow.decks.piratas.hand.length,used:flow.markers.filter(m=>m.f==='piratas'&&m.used).length}))).toEqual({cards:2,used:0});
  await page.locator('#handArea [data-card-index="1"]').click();
  await expect(page.locator('#cardDetail #executeAction')).toBeVisible();
  await expect(page.locator('#executeAction')).toHaveCount(1);
  await page.locator('#handArea [data-card-index="0"]').click();
  await expect(page.locator('#executeAction')).toHaveCount(1);
  await page.locator('#executeAction').click();
  await expect(page.locator('#actionDialog')).toBeHidden();
  expect(await page.evaluate(() => flow.markers.filter(m=>m.f==='piratas'&&m.used).length)).toBe(1);
  expect(erros).toEqual([]);
});

test('resumos e registro ficam em Ferramentas', async ({ page }) => {
  const erros=await abrir(page);
  await expect(page.locator('#flow')).not.toContainText('Hipóteses de teste');
  await page.locator('.debug-drawer > summary').click();
  const tools=page.locator('#gameTools');
  for(const title of ['Origem dos pontos','Hipóteses de teste','Resumo dos baralhos e mãos','Registro da rodada']) await expect(tools).toContainText(title);
  expect(erros).toEqual([]);
});

test('vitória interrompe a partida e o cenário pode ser reiniciado', async ({ page }, info) => {
  const erros=await abrir(page);
  await preparar(page);
  // Coloca os Elfos a um ponto da vitória para exercitar o encerramento pela pontuação real.
  await page.evaluate(() => { game.score.elfos=29; });
  for(let i=0;i<8;i++) await page.locator('#passAction').click();
  await page.locator('#toScore').click();
  await expect(page.locator('#flow')).toContainText('Vencedor: Elfos');
  await evidencia(page,info,'fim-partida');
  await page.locator('#reset').click();
  await expect(page.locator('#startRound')).toBeVisible();
  expect(await page.evaluate(() => game.winner)).toBeNull();
  expect(erros).toEqual([]);
});

test('Canção de paz cancela o combate sem desfazer o movimento', async ({ page }, info) => {
  const erros=await abrir(page);
  await preparar(page);
  await configurarCenario(page, 'paz');
  await page.locator('[data-region="R4"]').click();
  await page.locator('#handArea [data-card-index="0"]').click();
  await page.locator('#attackDefender').selectOption('necromante');
  await page.locator('#move-R2').fill('1');
  await page.locator('#prepareAttack').click();
  await page.locator('#skipDefense').click();
  await page.locator('#usePeace').click();
  await page.locator('#rollBattle').click();
  await evidencia(page,info,'cancao-de-paz');
  await page.locator('#applyBattle').click();
  expect(await page.evaluate(() => ({i:state.R4.units.imperio,n:state.R4.units.necromante,elfo:flow.decks.elfos.discard.some(c=>c.name==='Canção de paz')}))).toEqual({i:1,n:1,elfo:true});
  expect(erros).toEqual([]);
});

test('tela cheia pode ser acionada quando suportada', async ({ page }, info) => {
  test.skip(info.project.name==='celular', 'Suporte de tela cheia depende do navegador e dispositivo móvel.');
  const erros=await abrir(page);
  const supported=await page.evaluate(() => !!document.fullscreenEnabled);
  test.skip(!supported, 'Navegador sem suporte à API de tela cheia.');
  await page.locator('#fullscreen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect(page.locator('body > header')).toBeHidden();
  await expect(page.locator('#fullscreenPhases')).toBeVisible();
  await expect(page.locator('#exitFullscreen')).toBeFocused();
  await page.locator('#toolsDrawer > summary').click();
  await expect(page.locator('#gameTools')).toBeVisible();
  await page.locator('#toolsDrawer > summary').click();
  await page.locator('#exitFullscreen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await expect(page.locator('body > header')).toBeVisible();
  await expect(page.locator('#fullscreen')).toBeFocused();
  expect(erros).toEqual([]);
});

test('cabeçalho mantém botões uniformes e acompanha as fases', async ({ page }, info) => {
  test.skip(info.project.name!=='desktop', 'A largura dos controles se adapta a telas estreitas.');
  const erros=await abrir(page);
  const sizes=await page.evaluate(() => ['#fullscreen','#reset','.debug-drawer > summary'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.width,r.height]}));
  expect(sizes[1]).toEqual(sizes[0]);
  expect(sizes[2]).toEqual(sizes[0]);
  await expect(page.locator('#headerPhases [aria-current="step"]')).toHaveText('Preparação');
  await page.locator('#startRound').click();
  await expect(page.locator('#headerPhases [aria-current="step"]')).toHaveText('Preparação');
  await page.locator('#imperialRecruit').selectOption('R1');
  await page.locator('#confirmImperialRecruit').click();
  await expect(page.locator('#headerPhases [aria-current="step"]')).toHaveText('Liderança');
  for(let i=0;i<4;i++)await page.locator('#passBid').click();
  await expect(page.locator('#headerPhases [aria-current="step"]')).toHaveText('Ações');
  expect(erros).toEqual([]);
});

test('ação inválida informa o problema sem gastar recursos, carta ou ação', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  await configurarCenario(page, 'rodada');
  await page.locator('[data-region="R10"]').click();
  await page.locator('#handArea [data-card-index="0"]').click();
  const antes=await page.evaluate(() => ({ouro:resources.imperio.ouro,tropas:state.R10.units.imperio,mao:flow.decks.imperio.hand.length,acoes:flow.markers.filter(m=>m.f==='imperio'&&!m.used).length}));
  await page.locator('#executeAction').click();
  await expect(page.locator('#actionError')).not.toBeEmpty();
  expect(await page.evaluate(() => ({ouro:resources.imperio.ouro,tropas:state.R10.units.imperio,mao:flow.decks.imperio.hand.length,acoes:flow.markers.filter(m=>m.f==='imperio'&&!m.used).length}))).toEqual(antes);
  expect(erros).toEqual([]);
});

test('registra o conceito aprovado para comparação humana', async ({ page }, info) => {
  const erros=[];page.on('pageerror',e=>erros.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../../prototipo/mesa-conceito.html')).href);
  await expect(page.locator('.region')).toHaveCount(11);
  await evidencia(page,info,'conceito-mesa');
  expect(erros).toEqual([]);
});

test('mesa desktop ocupa a janela e exibe todas as regiões sem rolagem no mapa', async ({ page }, info) => {
  test.skip(info.project.name!=='desktop', 'Em telas pequenas o mapa mantém rolagem para preservar a legibilidade.');
  for (const size of [{width:1920,height:900},{width:1440,height:900},{width:1366,height:768}]) {
    await page.setViewportSize(size);
    const erros=await abrir(page);
    await preparar(page);
    const layout=await page.evaluate(() => {
      const board=document.querySelector('.board-panel').getBoundingClientRect();
      const wrap=document.querySelector('.mapwrap');
      const viewport=wrap.getBoundingClientRect();
      const outside=[...document.querySelectorAll('.region')].filter(e=>{
        const r=e.getBoundingClientRect();
        return r.left<viewport.left-1 || r.right>viewport.right+1 || r.top<viewport.top-1 || r.bottom>viewport.bottom+1;
      }).map(e=>e.dataset.region);
      const card=document.querySelector('#handArea .hand-card').getBoundingClientRect();
      const hand=document.querySelector('#handArea').getBoundingClientRect();
      return {width:board.width,height:board.height,scroll:wrap.scrollHeight-wrap.clientHeight, horizontal:wrap.scrollWidth-wrap.clientWidth,outside, cardBottom:card.bottom,handBottom:hand.bottom};
    });
    expect(layout.width).toBeGreaterThan(size.width*.65);
    expect(layout.height).toBeGreaterThan(size.height*.45);
    expect(layout.scroll).toBeLessThanOrEqual(1);
    expect(layout.horizontal).toBeLessThanOrEqual(1);
    expect(layout.outside).toEqual([]);
    expect(layout.cardBottom).toBeLessThanOrEqual(Math.min(layout.handBottom,size.height)+1);
    expect(erros).toEqual([]);
  }
  await evidencia(page,info,'mesa-desktop-integral');
});
