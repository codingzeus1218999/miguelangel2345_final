import {
  getChatbotSettingsBet,
  createChatbotSettingsBet,
  updateChatbotSettingsBet,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get(
    "/admin/chatbot/settings/bet",
    isAuthorized,
    getChatbotSettingsBet
  );
  router.post(
    "/admin/chatbot/settings/bet",
    isAuthorized,
    createChatbotSettingsBet
  );
  router.put(
    "/admin/chatbot/settings/bet",
    isAuthorized,
    updateChatbotSettingsBet
  );
};
