import mongoose from "mongoose";

const ChatbotBetSettingSchema = new mongoose.Schema({
  created: { type: String, required: true },
  joinSuccess: { type: String, required: true },
  alreadyJoined: { type: String, required: true },
  notRegisteredUser: { type: String, required: true },
  doneInTime: { type: String, required: true },
  doneOnTime: { type: String, required: true },
  resultNotice: { type: String, required: true },
  distributedPoints: { type: String, required: true },
  refundNotice: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ChatbotBetSettingModel = mongoose.model(
  "ChatbotBetSetting",
  ChatbotBetSettingSchema
);
