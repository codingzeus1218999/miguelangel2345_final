require("dotenv").config();
const playwright = require("playwright-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const EventEmitter = require("events");
const colors = require("colors");

const constants = require("./constants");

const emitter = new EventEmitter();

const blockedResources = [
  "*/favicon.ico",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".woff",
  ".woff2",
  ".webp",
  "q.stripe.com",
];

let browser, page, client, context;

async function sendMessage(message) {
  await page.evaluate(async (message) => {
    const messageInput = document.querySelector('div[id="message-input"]');
    messageInput.focus();
    messageInput.textContent = message;
    const enterKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
    messageInput.dispatchEvent(enterKeyEvent);
    const agreeButton = document.querySelector(
      'button[class="variant-action size-sm !w-full"]'
    );
    if (agreeButton) {
      agreeButton.click();
      messageInput.dispatchEvent(enterKeyEvent);
    }
  }, message);
}

async function initBrowser(botMail, botPwd) {
  console.log("Launching browser...".bgWhite.yellow);
  playwright.chromium.use(stealthPlugin());
  browser = await playwright.chromium.launch({
    headless: false,
    devtools: false,
  });
  console.log("Browser opened...".bgWhite.green);
  context = await browser.newContext();
  page = await context.newPage();
  client = await page.context().newCDPSession(page);
  await client.send("Network.setBlockedURLs", { urls: blockedResources });
  await client.send("Network.enable");
  await page.goto(`${constants.KICK_URL}/${constants.GUIDLINE_PATHNAME}`);

  // Click on the login button
  await page.click("#login-button");

  // Wait for the login form to appear
  await page.waitForSelector('input[placeholder="you@example.com"]');

  // Fill in the username and password fields
  await page.type('input[placeholder="you@example.com"]', botMail);
  await page.type('input[type="password"]', botPwd);

  // js Timeout 5s
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Click on the submit button
  await page.click('button[type="submit"]');

  // Wait for the network request to complete
  await page.waitForSelector('button[id="headlessui-menu-button-3"]');

  // Go to channel
  await page.goto(`${constants.KICK_URL}/${constants.CHANNEL}`);

  // Wait for the network request to complete
  await page.waitForSelector('div[id="message-input"]');

  await sendMessage("Bot is Ready!");

  emitter.emit("ready");
}

module.exports = {
  initBrowser,
  sendMessage,
  emitter,
};
