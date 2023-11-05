import {
  getChatbotSettingsAdditionalCommands,
  createChatbotSettingsAdditionalCommand,
  updateChatbotSettingsAdditionalCommand,
  deleteChatbotSettingsAdditionalCommand,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get(
    "/admin/chatbot/settings/additional-commands",
    isAuthorized,
    getChatbotSettingsAdditionalCommands
  );
  router.post(
    "/admin/chatbot/settings/additional-command",
    isAuthorized,
    createChatbotSettingsAdditionalCommand
  );
  router.put(
    "/admin/chatbot/settings/additional-command",
    isAuthorized,
    updateChatbotSettingsAdditionalCommand
  );
  router.delete(
    "/admin/chatbot/settings/additional-command",
    isAuthorized,
    deleteChatbotSettingsAdditionalCommand
  );
};
