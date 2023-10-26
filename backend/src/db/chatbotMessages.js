import mongoose from "mongoose";

const ChatbotMessageSchema = new mongoose.Schema({
  event: { type: String, required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  isRegistered: { type: Boolean, required: true },
  isSubscriber: { type: Boolean, required: true },
  isModerator: { type: Boolean, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotMessageModel = mongoose.model(
  "ChatbotMessage",
  ChatbotMessageSchema
);
