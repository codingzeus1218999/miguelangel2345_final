import mongoose from "mongoose";

const TransferSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  twitchLogin: { type: String },
  twtichBroadcasterType: { type: String },
  twitchCreatedAt: { type: Date },
  twitchDescription: { type: String },
  twitchDisplayName: { type: String },
  twitchEmail: { type: String },
  twitchId: { type: String },
  twitchOfflineImageUrl: { type: String },
  twitchProfileImageUrl: { type: String },
  twitchType: { type: String },
  twitchViewCount: { type: Number },
  streamChannel: { type: String },
  streamPoints: { type: Number },
  streamPointsAlltime: { type: Number },
  streamRank: { type: Number },
  streamUsername: { type: String },
  streamWhatchtime: { type: Number },
  rate: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const TransferModel = mongoose.model("Transfer", TransferSchema);
