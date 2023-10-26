import pkg from "lodash";

import { ChatbotEventModel } from "../db/chatbotEvents.js";

const { get } = pkg;

export const getChatbotEvents = async (req, res) => {
  try {
    const events = await ChatbotEventModel.find({})
      .sort({ created_at: "desc" })
      .limit(req.query.count);
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const addChatbotEvent = async (req, res) => {
  try {
    const event = get(req.body, "event").toString();
    const content = get(req.body, "content").toString();
    const created_at = get(req.body, "created_at");

    const chatbotEvent = new ChatbotEventModel({
      event,
      content,
      created_at,
    });
    chatbotEvent
      .save()
      .then((event) =>
        res.status(200).json({
          success: true,
          event,
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
