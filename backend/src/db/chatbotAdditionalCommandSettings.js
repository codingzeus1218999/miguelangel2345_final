import mongoose from "mongoose";

const ChatbotAdditionalCommandSettingSchema = new mongoose.Schema({
  command: { type: String, required: true },
  reply: { type: String, required: true },
  allow: { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotAdditionalCommandSettingModel = mongoose.model(
  "ChatbotAdditionalCommandSetting",
  ChatbotAdditionalCommandSettingSchema
);
