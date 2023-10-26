import express from "express";
import auths from "./auths.js";
import users from "./users.js";
import prizes from "./prizes.js";
import raffles from "./raffles.js";
import chatbotSettingsGeneral from "./chatbotSettingsGeneral.js";
import chatbotSettingsCommand from "./chatbotSettingsCommand.js";
import chatbotMessages from "./chatbotMessages.js";
import chatbotEvents from "./chatbotEvents.js";
import serverMessages from "./serverMessages.js";

const router = express.Router();

export default () => {
  auths(router);
  users(router);
  prizes(router);
  raffles(router);
  chatbotSettingsGeneral(router);
  chatbotSettingsCommand(router);
  chatbotMessages(router);
  chatbotEvents(router);
  serverMessages(router);
  return router;
};
