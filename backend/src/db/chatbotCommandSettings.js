import mongoose from "mongoose";

const ChatbotCommandSettingSchema = new mongoose.Schema({
  raffleStart: { type: String, required: true },
  raffleJoin: { type: String, required: true },
  raffleEnd: { type: String, required: true },
  raffleNotReady: { type: String, required: true },
  raffleCant: { type: String, required: true },
  pointsRemaining: { type: String, required: true },
  pointsRemainingMsg: { type: String, required: true },
  pointsRemainingNotRegistered: { type: String, required: true },
  addPointsMsg: { type: String, required: true },
  addPointsMsgSuccess: { type: String, required: true },
  addPointsMsgNotPermission: { type: String, required: true },
  delPointsMsg: { type: String, required: true },
  delPointsMsgSuccess: { type: String, required: true },
  delPointsMsgNotPermission: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotCommandSettingModel = mongoose.model(
  "ChatbotCommandSetting",
  ChatbotCommandSettingSchema
);
