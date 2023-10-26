import { addChatbotEvent, getChatbotEvents } from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.post("/admin/chatbot/event", isAuthorized, addChatbotEvent);
  router.get("/admin/chatbot/events", isAuthorized, getChatbotEvents);
};
