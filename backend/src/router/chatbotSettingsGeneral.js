import {
  getChatbotSettingsGeneral,
  createChatbotSettingsGeneral,
  updateChatbotSettingsGeneral,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get(
    "/admin/chatbot/settings/general",
    isAuthorized,
    getChatbotSettingsGeneral
  );
  router.post(
    "/admin/chatbot/settings/general",
    isAuthorized,
    createChatbotSettingsGeneral
  );
  router.put(
    "/admin/chatbot/settings/general",
    isAuthorized,
    updateChatbotSettingsGeneral
  );
};
