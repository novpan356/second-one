import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const base=process.env.ATLAS_TEST_URL || 'http://127.0.0.1:5185';
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 for(const width of [320,360,390,430]) {
  await page.setViewportSize({width,height:844});
  for(const route of ['','fighter/jin/moves','fighter/king/combos','fighter/jin/punish','fighter/jin/movement','story','online','account','download']) {
   await page.goto(base+'/#'+route);
   if(route==='fighter/jin/moves') await page.locator('.move-name').first().waitFor();
   await page.locator('.mobile-dock').waitFor();
   await page.waitForTimeout(150);
   assert.ok(await page.evaluate(w=>document.documentElement.scrollWidth<=w && innerWidth===w,width),`${width}px ${route}: page overflow`);
  }
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/#fighter/kazuya/moves');
 const search=page.locator('.move-toolbar input');await search.fill('df2');
 await page.waitForFunction(()=>document.querySelector('.move-table tbody tr td:nth-child(2) code')?.textContent==='df+2');
 const card=page.locator('.move-table tbody tr').first();
 assert.equal(await card.evaluate(el=>getComputedStyle(el).display),'grid');
 for(const child of await card.locator('td').all()) {
  if(await child.isVisible())assert.ok(await child.evaluate(el=>el.getBoundingClientRect().right<=innerWidth), 'card column is outside viewport');
 }
 await card.scrollIntoViewIfNeeded();
 await page.screenshot({path:'/tmp/tekken-atlas-checks/android-move-card.png',fullPage:false});
 await page.locator('.move-name').first().click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();
 assert.ok(await dialog.evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
 await page.locator('.move-effects.expanded').scrollIntoViewIfNeeded();
 assert.ok(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth));
 await page.screenshot({path:'/tmp/tekken-atlas-checks/android-detail.png',fullPage:false});
 await page.getByRole('button',{name:'关闭',exact:true}).click();
 const dock=page.getByRole('navigation',{name:'快捷导航'});
 await dock.getByRole('button',{name:'实验室',exact:true}).click();await page.waitForURL('**/#lab');
 await dock.getByRole('button',{name:'我的',exact:true}).click();await page.waitForURL('**/#account');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 assert.match(await page.locator('.mobile-dock').innerText(),/Saved/);
 await page.getByRole('button',{name:'JP',exact:true}).click();
 assert.match(await page.locator('.mobile-dock').innerText(),/オンライン/);
 await page.getByRole('button',{name:'中',exact:true}).click();
 await page.goto(base+'/#download');
 assert.equal(await page.locator('.apk-download').getAttribute('href'),'https://novpan356.github.io/second-one/downloads/SYM-CREW-Android.apk');
 await page.goto(base);await page.locator('.fighter-card').first().waitFor();
 await page.locator('.mobile-brand-icon').evaluate(img=>img.decode());
 await page.screenshot({path:'/tmp/tekken-atlas-checks/android-home.png',fullPage:false});
 await page.context().setOffline(true);
 await page.evaluate(()=>window.dispatchEvent(new Event('offline')));
 await page.getByRole('status').filter({hasText:'当前离线'}).waitFor();
 await page.context().setOffline(false);
 assert.deepEqual(errors,[]);
 console.log('PASS: 320–430px portrait pages, touch navigation, full-width move cards, scrollable details, three languages, download link and offline notice.');
} finally {await browser.close();}
