const { chromium } = require("playwright");
(async () => {
 const browser = await chromium.launch({ channel: "chrome", headless: true });
 for (const context of [
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
 ]) {
  const page = await browser.newPage(context);
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  const track = page.locator(".animate-marquee");
  const first = await track.evaluate((element) => ({ transform: getComputedStyle(element).transform, animation: getComputedStyle(element).animationName }));
  await page.waitForTimeout(750);
  const second = await track.evaluate((element) => ({ transform: getComputedStyle(element).transform, animation: getComputedStyle(element).animationName }));
  console.log(context.name, JSON.stringify({ first, second, moving: first.transform !== second.transform }));
  await page.close();
 }
 await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
