import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base = process.env.ATLAS_TEST_URL || 'http://127.0.0.1:5183';
try {
 await page.goto(base+'/#fighter/kazuya/moves');
 const search = page.locator('.move-toolbar input');
 await search.waitFor();
 for(const q of ['d / f + RP','↘＋２','df2']) {
   await search.fill(q);
   await page.waitForFunction(()=>document.querySelector('.move-table tbody tr td:nth-child(2) code')?.textContent==='df+2');
 }
 await search.focus();
 const focused = await search.evaluate(el => ({text:getComputedStyle(el).color,background:getComputedStyle(el.closest('label')).backgroundColor,active:el===document.activeElement}));
 assert.equal(focused.active,true);
 assert.notEqual(focused.background,'rgb(255, 255, 255)');
 assert.equal(focused.text,'rgb(255, 255, 255)');
 await search.fill('electrc wind');
 await page.waitForFunction(()=>document.querySelector('.move-name')?.textContent.includes('Electric Wind God Fist'));
 await search.fill('中段 浮空');
 await page.locator('.move-name').first().click();
 await page.getByRole('dialog').waitFor();
 assert.match(await page.locator('.move-effects.expanded').innerText(),/普通命中.*[\s\S]*浮空/);
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 assert.match(await page.locator('.move-effects-cell').first().innerText(),/Airborne/);
 await page.getByRole('button',{name:'JP',exact:true}).click();
 assert.match(await page.locator('.move-effects-cell').first().innerText(),/空中状態/);
 await page.getByRole('button',{name:'中',exact:true}).click();
 await page.goto(base+'/#fighter/king/moves');
 await page.locator('.move-toolbar input').fill('Aerial Jaguar Bomb');
 await page.locator('.move-name').first().waitFor();
 assert.match(await page.locator('.move-effects-cell').first().innerText(),/脚朝对手（FUFT）/);
 await page.screenshot({path:'/tmp/tekken-atlas-checks/move-effects-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.locator('.move-name').first().click();
 await page.getByRole('dialog').waitFor();
 assert.match(await page.locator('.move-effects.expanded').innerText(),/脚朝对手（FUFT）/);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.ok(await page.locator('.move-effects.expanded').evaluate(el=>el.scrollWidth<=el.clientWidth));
 await page.screenshot({path:'/tmp/tekken-atlas-checks/move-effects-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: normalized commands, typo/keyword search, precise ground orientation, three languages and mobile detail without overflow.');
} finally {await browser.close();}
