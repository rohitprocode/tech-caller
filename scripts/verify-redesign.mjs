import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import assert from "node:assert/strict";

const loadModule = createRequire(import.meta.url);
const { chromium } = loadModule(process.env.PLAYWRIGHT_MODULE || "playwright");

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const output = process.env.QA_OUTPUT_DIR || "artifacts/redesign";

async function main() {
  mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [width, height] of [[1440, 900], [1366, 768], [1920, 1080], [768, 1024], [390, 844], [320, 700]]) {
      await page.setViewportSize({ width, height });
      const response = await page.goto(base, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      await page.screenshot({ path: output + "/home-" + width + ".png", fullPage: true });
      assert.equal(await page.locator("h1").innerText(), "Tech Caller.");
      assert.equal(await page.locator(".video-card").count(), 3);
      assert(await page.locator("#videos").evaluate((el) => el.getBoundingClientRect().top < window.innerHeight), "Next section should be visible at " + width);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Horizontal overflow at " + width);
      const broken = await page.locator("img").evaluateAll((images) => images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src));
      assert.deepEqual(broken, [], "Broken images");
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Work With Us" }).click();
    await page.waitForURL("**/work-with-us");
    assert.equal(await page.getByRole("navigation", { name: "Mobile primary" }).count(), 0);
    await page.screenshot({ path: output + "/work-mobile.png", fullPage: true });
    await page.getByRole("link", { name: "Discuss a website" }).click();
    await page.waitForURL("**/contact?type=development");
    assert.equal(await page.locator('select[name="type"]').inputValue(), "development");
    await page.getByLabel("Your name").fill("Website QA");
    await page.getByLabel("Your email", { exact: true }).fill("qa@example.com");
    await page.getByLabel("Business or project name").fill("A & B Studio");
    await page.getByLabel("Tell us about your website").fill("A website enquiry test. This draft is not sent.");
    await page.getByRole("button", { name: "Continue to email" }).click();
    await page.locator(".email-preview").waitFor();
    assert.match(await page.locator(".email-preview pre").innerText(), /A & B Studio/);
    assert.match(await page.locator('[role="status"]').innerText(), /Send it from your email app/);
    await page.screenshot({ path: output + "/contact-draft-mobile.png", fullPage: true });
    await page.getByLabel("What can we help you with?").selectOption("video-help");
    assert.equal(await page.locator(".email-preview").count(), 0);
    assert(await page.getByLabel("Video link", { exact: true }).evaluate((el) => el.required));
    await page.getByLabel("What can we help you with?").selectOption("other");
    assert.equal(await page.locator('[name="detail"]').count(), 0);
    for (const route of ["/about", "/contact", "/work-with-us", "/resources", "/admin/login"]) {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const response = await page.goto(base + route, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200, route);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + " overflow at " + width);
        await page.screenshot({ path: output + "/" + route.slice(1).replaceAll("/", "-") + "-" + width + ".png", fullPage: true });
      }
    }
    await page.goto(base + "/resources?search=nonexistent-redesign-qa&sort=downloads", { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("textbox", { name: "Search resources" }).inputValue(), "nonexistent-redesign-qa");
    assert.equal(await page.getByLabel("Sort", { exact: true }).inputValue(), "downloads");
    assert.deepEqual(errors, [], "Client runtime errors");
    console.log("PASS: 6 homepage sizes, loaded images, mobile navigation, enquiry draft and conditional fields, 5 routes at 2 sizes, resource filters, no client runtime errors.");
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
