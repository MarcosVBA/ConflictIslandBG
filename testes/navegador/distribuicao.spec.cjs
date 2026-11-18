'use strict';
const { test, expect } = require('@playwright/test');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

test('distribuição instala o cache e volta a abrir offline', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'desktop', 'A cópia distribuída é verificada uma vez em Chromium desktop.');
  const build=spawnSync(process.execPath, [path.join(root,'scripts/preparar-site.cjs')], {cwd:root,encoding:'utf8'});
  expect(build.status, build.stderr).toBe(0);
  const allowed = new Map([
    ['/index.html', ['index.html','text/html']], ['/', ['index.html','text/html']],
    ['/service-worker.js',['service-worker.js','text/javascript']], ['/manifest.webmanifest',['manifest.webmanifest','application/manifest+json']],
    ...['icon-192.png','icon-512.png','icon-maskable-512.png'].map(name=>[`/icons/${name}`,[`icons/${name}`,'image/png']]),
  ]);
  const server=http.createServer((req,res)=>{
    const item=allowed.get(new URL(req.url,'http://localhost').pathname);
    if(!item){res.writeHead(404).end();return}
    res.writeHead(200,{'Content-Type':item[1]});fs.createReadStream(path.join(root,'dist',item[0])).pipe(res);
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  try {
    const erros=[];page.on('pageerror',error=>erros.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(()=>navigator.serviceWorker.ready);
    await expect.poll(()=>page.evaluate(async()=>!!(await caches.match('./index.html')))).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('.region')).toHaveCount(10);
    await expect(page.locator('#startRound')).toBeVisible();
    expect(erros).toEqual([]);
  } finally {
    await context.setOffline(false);
    await new Promise(resolve=>server.close(resolve));
  }
});
