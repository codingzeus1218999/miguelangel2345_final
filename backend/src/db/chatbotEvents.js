import mongoose from "mongoose";

const ChatbotEventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotEventModel = mongoose.model(
  "ChatbotEvent",
  ChatbotEventSchema
);
