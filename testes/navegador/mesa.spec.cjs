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
  if (process.env.VISUAL_CHECK !== '1' && process.env.CAPTURAS !== '1') return;
  const imagem = info.outputPath(`${nome}.png`);
  await page.screenshot({ path: imagem, fullPage: true, animations: 'disabled' });
  await info.attach(nome, { path: imagem, contentType: 'image/png' });
  // Comparações só são habilitadas quando houver uma referência revisada.
  if (process.env.VISUAL_CHECK === '1') await expect(page).toHaveScreenshot(`${nome}.png`, { fullPage: true, animations: 'disabled' });
}
async function preparar(page) {
  await expect(page.locator('#phaseDialog')).toBeVisible();
  await expect(page.locator('#phaseDialog')).toHaveAttribute('aria-label','Preparação da rodada');
  await page.locator('#orderChoice').selectOption('imperio');
  await page.locator('#startRound').click();
  if (await page.locator('#confirmImperialRecruit').isVisible()) {
    await expect(page.locator('#phaseDialog')).toBeHidden();
    await page.locator('#imperialRecruit').selectOption('R1');
    await page.locator('#confirmImperialRecruit').click();
  }
  await expect(page.locator('#phaseDialog')).toHaveAttribute('aria-label','Leilão de liderança');
  await expect(page.locator('#phaseDialog #handArea')).toBeVisible();
  for (let i=0; i<4; i++) await page.locator('#passBid').click();
  await expect(page.locator('#phaseDialog')).toBeHidden();
  await expect(page.locator('.board-panel #handArea')).toBeVisible();
}

test('abre offline, mostra o mapa e permite selecionar regiões por teclado', async ({ page }, info) => {
  const erros = await abrir(page);
  await expect(page.locator('.region')).toHaveCount(10);
  await expect(page.locator('#lines path, #lines line')).not.toHaveCount(0);
  await preparar(page);
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
  await preparar(page);
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
  await expect(page.locator('#lines path')).toHaveCount(16);
  await evidencia(page, info, 'informacoes-sobre-mapa');
  await toggle.click();
  await expect(infoRegiao).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.locator('[data-region="R11"]').click();
  await expect(page.locator('#lines path')).toHaveCount(16);
  await toggle.click();
  await expect(infoRegiao).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(infoRegiao).toContainText('R11');
  expect(erros).toEqual([]);
});

test('clicar em espaço vazio limpa a seleção sem gastar ação ou carta', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  await configurarCenario(page, 'rodada');
  await page.locator('[data-region="R1"]').click();
  await page.locator('#handArea [data-card-index="0"]').click();
  await expect(page.locator('#handArea .hand-card.chosen')).toHaveCount(1);
  const antes=await page.evaluate(()=>({ouro:resources.imperio.ouro,mao:flow.decks.imperio.hand.length,acoes:flow.markers.filter(m=>m.f==='imperio'&&!m.used).length}));
  await page.locator('#map').click({position:{x:5,y:5}});
  await expect(page.locator('.region.selected')).toHaveCount(0);
  await expect(page.locator('#handArea .hand-card.chosen')).toHaveCount(0);
  await expect(page.locator('#actionRegion')).toHaveValue('');
  await expect(page.locator('#details')).toContainText('Selecione uma região');
  expect(await page.evaluate(()=>({ouro:resources.imperio.ouro,mao:flow.decks.imperio.hand.length,acoes:flow.markers.filter(m=>m.f==='imperio'&&!m.used).length}))).toEqual(antes);
  await page.locator('#handArea [data-card-index="0"]').click();
  await page.locator('[data-mode="0"]').click();
  await expect(page.locator('#cardDetail')).toContainText('Selecione a região');
  await page.locator('[data-region="R1"]').click();
  await expect(page.locator('#actionRegion')).toHaveValue('R1');
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
  expect(dimensions.meeple).toEqual([20,20]);
  expect(dimensions.construcao).toEqual([20,20]);
  expect(dimensions.recurso).toEqual([20,20]);
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
  await page.evaluate(() => { flow.decks.imperio.hand=[{name:'Marcha Imperial',text:'Atacar',leadership:1},{name:'Guarda Imperial',text:'Reação',leadership:0}];renderFlow(); });
  await page.locator('#handArea [data-card-index="0"]').click();
  await expect(page.locator('#handArea [data-card-index="0"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('#submitBid').click();
  for (let i=0;i<3;i++) await page.locator('#passBid').click();
  await expect(page.locator('#flow')).toContainText('Vez: Império');
  expect(await page.evaluate(() => flow.decks.imperio.discard.some(c=>c.name==='Marcha Imperial'))).toBe(true);
  await page.locator('#handArea [data-card-index="0"]').click();
  await page.locator('#discardAction').click();
  await expect(page.locator('#flow')).not.toContainText('Vez: Império');
  expect(erros).toEqual([]);
});

test('preparação e liderança usam janelas sobre a mesa', async ({ page }, info) => {
  const erros=await abrir(page);
  await expect(page.locator('#phaseDialog')).toHaveAttribute('aria-label','Preparação da rodada');
  await page.keyboard.press('Escape');
  await expect(page.locator('#phaseDialog')).toBeVisible();
  await evidencia(page,info,'preparacao-modal');
  await page.locator('#startRound').click();
  await expect(page.locator('#phaseDialog')).toBeHidden();
  await page.locator('#imperialRecruit').selectOption('R1');
  await page.locator('#confirmImperialRecruit').click();
  await expect(page.locator('#phaseDialog')).toHaveAttribute('aria-label','Leilão de liderança');
  await page.locator('#phaseDialog #handArea [data-card-index="0"]').click();
  await expect(page.locator('#handArea [data-card-index="0"]')).toHaveAttribute('aria-pressed','true');
  await evidencia(page,info,'lideranca-modal');
  for(let i=0;i<4;i++)await page.locator('#passBid').click();
  await expect(page.locator('#phaseDialog')).toBeHidden();
  await expect(page.locator('.board-panel #handArea')).toBeVisible();
  expect(erros).toEqual([]);
});

test('leilão, ações das quatro facções e próxima rodada', async ({ page }, info) => {
  const erros=await abrir(page);
  await preparar(page);
  // Mãos fixas tornam o percurso reproduzível; os efeitos são executados pela interface.
  await configurarCenario(page, 'rodada');
  for(const [f,region,mode] of [['imperio','R1',0],['necromante','R4',1],['piratas','R5',1],['elfos','R10',0]]) {
    await expect(page.locator('#handArea')).toHaveAttribute('data-faction',f);
    await page.locator('#handArea [data-card-index="0"]').click();
    await page.locator(`[data-mode="${mode}"]`).click();
    if (!["necromante", "elfos"].includes(f)) await page.locator(`[data-region="${region}"]`).click();
    await evidencia(page,info,`mao-${f}`);
    await page.locator('#executeAction').click();
  }
  const resultado=await page.evaluate(() => ({i:resources.imperio.ouro,n:resources.necromante.madeira,p:state.R5.units.piratas,e:resources.elfos.madeira}));
  expect(resultado).toEqual({i:2,n:2,p:2,e:2});
  await page.locator('#toScore').click();
  await expect(page.locator('#nextRound')).toBeVisible();
  await page.locator('#nextRound').click();
  await expect(page.locator('#flow')).toContainText('Rodada 2');
  expect(erros).toEqual([]);
});

test('resumos e registro ficam em Ferramentas', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  await expect(page.locator('#flow')).not.toContainText('Hipóteses de teste');
  await page.locator('.debug-drawer > summary').click();
  const tools=page.locator('#gameTools');
  for(const title of ['Origem dos pontos','Hipóteses de teste','Resumo dos baralhos e mãos','Registro da rodada']) await expect(tools).toContainText(title);
  expect(erros).toEqual([]);
});

test('regras e estado da facção atual ficam acessíveis em modal', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  for (const [f,nome,regra] of [['imperio','Império','Alistamento obrigatório'],['necromante','Necromante','Magia da Torre'],['piratas','Piratas','Ilha à Vista'],['elfos','Elfos','Guardiões da Floresta']]) {
    await expect(page.locator('#handArea')).toHaveAttribute('data-faction','imperio');
    await expect(page.locator(`[data-faction-info="${f}"]`)).toHaveCSS('padding','0px');
    await page.locator(`[data-faction-info="${f}"]`).click();
    await expect(page.locator('#factionDialog')).toBeVisible();
    await expect(page.locator('#factionInfoContent h2')).toHaveText(nome);
    await expect(page.locator('#factionInfoContent')).toContainText(regra);
    await expect(page.locator('#factionInfoContent')).toContainText('pontos');
    await page.locator('#closeFactionInfo').click();
    await expect(page.locator('#factionDialog')).toBeHidden();
  }
  expect(erros).toEqual([]);
});

test('a mão não alarga a página em telas pequenas', async ({ page }, info) => {
  test.skip(info.project.name !== 'celular', 'Verificação específica de largura móvel.');
  const erros=await abrir(page);
  await preparar(page);
  const largura=await page.evaluate(() => ({pagina:document.documentElement.scrollWidth,janela:document.documentElement.clientWidth}));
  expect(largura.pagina).toBeLessThanOrEqual(largura.janela+1);
  expect(erros).toEqual([]);
});

test('vitória interrompe a partida e o cenário pode ser reiniciado', async ({ page }, info) => {
  const erros=await abrir(page);
  await preparar(page);
  // Coloca os Elfos a um ponto da vitória para exercitar o encerramento pela pontuação real.
  await page.evaluate(() => { game.score.elfos=19; });
  for(let i=0;i<8;i++) { await page.locator('#handArea [data-card-index="0"]').click(); await page.locator('#discardAction').click(); }
  await page.locator('#toScore').click();
  await expect(page.locator('#flow')).toContainText('Vencedor: Elfos');
  await evidencia(page,info,'fim-partida');
  await page.locator('#reset').click();
  await expect(page.locator('#startRound')).toBeVisible();
  expect(await page.evaluate(() => game.winner)).toBeNull();
  expect(erros).toEqual([]);
});

test('tela cheia pode ser acionada quando suportada', async ({ page }, info) => {
  test.skip(info.project.name==='celular', 'Suporte de tela cheia depende do navegador e dispositivo móvel.');
  const erros=await abrir(page);
  const supported=await page.evaluate(() => !!document.fullscreenEnabled);
  test.skip(!supported, 'Navegador sem suporte à API de tela cheia.');
  await page.locator('#phaseFullscreen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect(page.locator('#phaseFullscreen')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await expect(page.locator('#phaseDialog')).toBeVisible();
  await preparar(page);
  await page.locator('#fullscreen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect(page.locator('body > header')).toBeHidden();
  await expect(page.locator('#headerPhases')).toBeVisible();
  await expect(page.locator('#toolsDrawer')).toBeHidden();
  expect((await page.locator('#statusBar').boundingBox()).y).toBeLessThanOrEqual(1);
  await page.keyboard.press('Escape');
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
  const espaco=await page.evaluate(()=>document.querySelector('body > header').getBoundingClientRect().bottom-document.querySelector('body > header small').getBoundingClientRect().bottom);
  expect(espaco).toBeGreaterThanOrEqual(4);
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

test('mão extensa permanece rolável sem botões de seta', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  await page.evaluate(()=>{
    flow.decks.imperio.hand=Array.from({length:10},(_,i)=>({name:'Marcha Imperial',text:`Carta ${i+1}`,leadership:1}));
    renderFlow();
  });
  await expect(page.locator('#handPrev, #handNext')).toHaveCount(0);
  const viewport=page.locator('#handViewport');
  expect(await viewport.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
  await viewport.focus();
  for(let i=0;i<5;i++)await page.keyboard.press('ArrowRight');
  await expect.poll(()=>viewport.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
  expect(erros).toEqual([]);
});

test('ação inválida informa o problema sem gastar recursos, carta ou ação', async ({ page }) => {
  const erros=await abrir(page);
  await preparar(page);
  await configurarCenario(page, 'rodada');
  await page.locator('#handArea [data-card-index="0"]').click();
  await page.locator('[data-mode="0"]').click();
  await page.locator('[data-region="R10"]').click();
  const antes=await page.evaluate(() => ({ouro:resources.imperio.ouro,tropas:state.R10.units.imperio,mao:flow.decks.imperio.hand.length,acoes:flow.markers.filter(m=>m.f==='imperio'&&!m.used).length}));
  await page.locator('#executeAction').click();
  await expect(page.locator('#actionError')).not.toBeEmpty();
  expect(await page.evaluate(() => ({ouro:resources.imperio.ouro,tropas:state.R10.units.imperio,mao:flow.decks.imperio.hand.length,acoes:flow.markers.filter(m=>m.f==='imperio'&&!m.used).length}))).toEqual(antes);
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
      const clipped=[...document.querySelectorAll('.region')].filter(e=>{
        const r=e.getBoundingClientRect();
        const hit=document.elementFromPoint(r.left+r.width/2,r.bottom-2);
        return !hit || hit.closest('.region')!==e;
      }).map(e=>e.dataset.region);
      const card=document.querySelector('#handArea .hand-card').getBoundingClientRect();
      const hand=document.querySelector('#handArea').getBoundingClientRect();
      const heading=document.querySelector('#handArea .hand-heading').getBoundingClientRect();
      const sidebar=document.querySelector('.sidebar').getBoundingClientRect();
      const scoreboard=document.querySelector('#statusBar').getBoundingClientRect();
      const phases=document.querySelector('#headerPhases').getBoundingClientRect();
      const obscured=[...document.querySelectorAll('.region')].filter(e=>e.getBoundingClientRect().bottom>heading.top+1).map(e=>e.dataset.region);
      const background=getComputedStyle(document.querySelector('#handArea')).backgroundColor;
      return {width:board.width,height:board.height,scroll:wrap.scrollHeight-wrap.clientHeight, horizontal:wrap.scrollWidth-wrap.clientWidth,outside,clipped, cardBottom:card.bottom,handBottom:hand.bottom,sideBottom:sidebar.bottom,handTop:hand.top,obscured,background,scoreBottom:scoreboard.bottom,phaseTop:phases.top,phaseBottom:phases.bottom,boardTop:board.top,inside:document.querySelector('.board-panel').contains(document.querySelector('#handArea'))};
    });
    expect(layout.width).toBeGreaterThan(size.width*.65);
    expect(layout.height).toBeGreaterThan(size.height*.45);
    expect(layout.scroll).toBeLessThanOrEqual(1);
    expect(layout.horizontal).toBeLessThanOrEqual(1);
    expect(layout.outside).toEqual([]);
    expect(layout.clipped).toEqual([]);
    expect(layout.cardBottom).toBeLessThanOrEqual(Math.min(layout.handBottom,size.height)+1);
    expect(layout.inside).toBe(true);
    expect(layout.background).toBe('rgba(0, 0, 0, 0)');
    expect(layout.sideBottom).toBeGreaterThanOrEqual(size.height-1);
    expect(layout.scoreBottom).toBeLessThanOrEqual(layout.phaseTop+1);
    expect(layout.phaseBottom).toBeLessThanOrEqual(layout.boardTop+1);
    expect(layout.obscured).toEqual([]);
    expect(erros).toEqual([]);
  }
  await evidencia(page,info,'mesa-desktop-integral');
});
