import mongoose from "mongoose";

const ChatbotGeneralSettingSchema = new mongoose.Schema({
  channel1: { type: String, required: true },
  channel2: { type: String, required: true },
  ws_end_point: { type: String, required: true },
  description: { type: String, default: "" },
  time_duration: { type: Number, default: 600 },
  points_unit: { type: Number, default: 10 },
  subscriber_multiple: { type: Number, default: 2 },
  subscriber_points: { type: Number, default: 100 },
  autoRaffle: { type: Boolean, default: true },
  autoRafflePoints: { type: Number, default: 10 },
  autoRaffleTime: { type: Number, default: 60 },
  autoRaffleBetween: { type: Number, default: 60 },
  autoRaffleWinnerCount: { type: Number, default: 3 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotGeneralSettingModel = mongoose.model(
  "ChatbotGeneralSetting",
  ChatbotGeneralSettingSchema
);
