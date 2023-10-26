import pkg from "lodash";

import { ChatbotMessageModel } from "../db/chatbotMessages.js";
import { UserModel } from "../db/users.js";

const { get } = pkg;

export const getChatbotMessages = async (req, res) => {
  try {
    const messages = await ChatbotMessageModel.find({})
      .sort({ created_at: "desc" })
      .limit(req.query.count);
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const addChatbotMessage = async (req, res) => {
  try {
    const event = get(req.body, "event").toString();
    const name = get(req.body, "name").toString();
    const content = get(req.body, "content").toString();
    const created_at = get(req.body, "created_at");
    const badges = get(req.body, "badges");
    const user = await UserModel.findOne({ allowed: true, name });
    const isRegistered = !(user === null);
    const isSubscriber = badges.some((obj) => obj?.type === "subscriber");
    const isModerator = badges.some((obj) => obj?.type === "moderator");

    const chatbotMessage = new ChatbotMessageModel({
      event,
      name,
      content,
      isRegistered,
      isSubscriber,
      isModerator,
      created_at,
    });
    chatbotMessage
      .save()
      .then((msg) =>
        res.status(200).json({
          success: true,
          msg,
        })
      )
      .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
