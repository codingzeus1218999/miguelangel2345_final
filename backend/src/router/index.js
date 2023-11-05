import express from "express";
import auths from "./auths.js";
import users from "./users.js";
import items from "./items.js";
import raffles from "./raffles.js";
import itemRaffles from "./itemRaffles.js";
import chatbotSettingsGeneral from "./chatbotSettingsGeneral.js";
import chatbotSettingsCommand from "./chatbotSettingsCommand.js";
import chatbotSettingsAdditionalCommand from "./chatbotSettingsAdditionalCommand.js";
import chatbotMessages from "./chatbotMessages.js";
import chatbotEvents from "./chatbotEvents.js";
import serverMessages from "./serverMessages.js";

const router = express.Router();

export default () => {
  auths(router);
  users(router);
  items(router);
  raffles(router);
  itemRaffles(router);
  chatbotSettingsGeneral(router);
  chatbotSettingsCommand(router);
  chatbotSettingsAdditionalCommand(router);
  chatbotMessages(router);
  chatbotEvents(router);
  serverMessages(router);
  return router;
};
