import { addChatbotMessage, getChatbotMessages } from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.post("/admin/chatbot/message", isAuthorized, addChatbotMessage);
  router.get("/admin/chatbot/messages", isAuthorized, getChatbotMessages);
};
