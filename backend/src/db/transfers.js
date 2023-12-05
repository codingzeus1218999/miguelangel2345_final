import mongoose from "mongoose";

const TransferSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  twitchUserName: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const TransferModel = mongoose.model("Transfer", TransferSchema);
