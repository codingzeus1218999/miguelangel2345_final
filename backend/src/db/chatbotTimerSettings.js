import mongoose from "mongoose";

const ChatbotTimerSettingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true, default: 60, min: 1 },
  message: { type: String, required: true },
  allow: { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotTimerSettingModel = mongoose.model(
  "ChatbotTimerSetting",
  ChatbotTimerSettingSchema
);
