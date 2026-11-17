const { chromium } = require("playwright");
(async () => {
 const browser = await chromium.launch({ channel: "chrome", headless: true });
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
 await page.waitForTimeout(700);
 const button = page.getByRole("link", { name: /See case study/ }).first();
 const read = () => button.evaluate((element) => ({
   transform: getComputedStyle(element).transform,
   background: getComputedStyle(element).backgroundColor,
   shadow: getComputedStyle(element).boxShadow,
 }));
 const before = await read();
 await button.hover({ force: true, timeout: 3000 });
 await page.waitForTimeout(250);
 const after = await read();
 console.log(JSON.stringify({ before, after, stableTransform: before.transform === after.transform }, null, 2));
 await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
