const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
const blockResourcesPlugin =
  require("puppeteer-extra-plugin-block-resources")();
const EventEmitter = require("events");
const fs = require("node:fs");
require("dotenv").config();

const constants = require("./constants");
const { printMessage } = require("./utils");

puppeteer.use(stealthPlugin);
puppeteer.use(blockResourcesPlugin);
const emitter = new EventEmitter();

let browser, page, cookies;

async function sendMessage(message) {
  await page.evaluate(async (message) => {
    const messageInput = document.querySelector('div[id="message-input"]');
    messageInput.focus();
    messageInput.textContent = message;
    const enterKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
    const agreeButton = document.querySelector(
      'button[class="variant-action size-md base-button"]'
    );
    if (agreeButton) {
      agreeButton.click();
    }
    messageInput.dispatchEvent(enterKeyEvent);
  }, message);
}

async function initBrowser(botMail, botPwd) {
  printMessage("Launching browser", "info");
  browser = await puppeteer.launch({ headless: false, devtools: false });
  page = await browser.newPage();
  blockResourcesPlugin.blockedTypes.add("image");
  blockResourcesPlugin.blockedTypes.add("media");
  blockResourcesPlugin.blockedTypes.add("font");
  printMessage("Browser opened", "success");
  await page.goto(`${constants.KICK_URL}`);

  while ((await page.$("#login-button")) !== null) {
    try {
      // If old cookies exist
      fs.accessSync("./cookies.json", fs.constants.F_OK);
      const cookiesString = fs.readFileSync("./cookies.json");
      cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
      await page.goto(`${constants.KICK_URL}/${constants.GUIDLINE_PATHNAME}`);
      // If cookies live time is expired
      if ((await page.$('button[id="headlessui-menu-button-3"]')) === null) {
        fs.unlinkSync("./cookies.json");
      }
    } catch (err) {
      // If no exist cookies
      // Click on the login button
      await page.click("#login-button");

      // Wait for the login form to appear
      await page.waitForSelector('input[placeholder="you@example.com"]');

      // Fill in the username and password fields
      await page.type('input[placeholder="you@example.com"]', botMail);
      await page.type('input[type="password"]', botPwd);

      // Wait 5s
      await page.waitForTimeout(5000);

      // Click on the submit button
      await page.click('button[type="submit"]');

      // Wait for the network request to complete
      await page.waitForSelector('button[id="headlessui-menu-button-3"]');
    }
  }

  // Go to channel
  await page.goto(`${constants.KICK_URL}/${constants.CHANNEL}`);

  // Wait for the network request to complete
  await page.waitForSelector('div[id="message-input"]');

  // Save the cookies
  cookies = await page.cookies();
  fs.writeFileSync("./cookies.json", JSON.stringify(cookies, null, 2));

  await sendMessage("Bot is Ready!");

  emitter.emit("ready");
}

module.exports = {
  initBrowser,
  sendMessage,
  emitter,
};
