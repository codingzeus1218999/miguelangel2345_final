import {
  getChatbotSettingsCommand,
  createChatbotSettingsCommand,
  updateChatbotSettingsCommand,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get(
    "/admin/chatbot/settings/command",
    isAuthorized,
    getChatbotSettingsCommand
  );
  router.post(
    "/admin/chatbot/settings/command",
    isAuthorized,
    createChatbotSettingsCommand
  );
  router.put(
    "/admin/chatbot/settings/command",
    isAuthorized,
    updateChatbotSettingsCommand
  );
};
