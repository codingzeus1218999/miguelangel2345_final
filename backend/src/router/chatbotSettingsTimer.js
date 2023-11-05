import {
  getChatbotSettingsTimers,
  createChatbotSettingsTimer,
  updateChatbotSettingsTimer,
  deleteChatbotSettingsTimer,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get(
    "/admin/chatbot/settings/timers",
    isAuthorized,
    getChatbotSettingsTimers
  );
  router.post(
    "/admin/chatbot/settings/timer",
    isAuthorized,
    createChatbotSettingsTimer
  );
  router.put(
    "/admin/chatbot/settings/timer",
    isAuthorized,
    updateChatbotSettingsTimer
  );
  router.delete(
    "/admin/chatbot/settings/timer",
    isAuthorized,
    deleteChatbotSettingsTimer
  );
};
