import mongoose from "mongoose";

const RaffleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true },
  time: { type: Number, required: true },
  winnerCount: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  state: { type: String, default: "pending" },
  created_at: { type: Date, required: true, default: Date.now },
});

export const RaffleModel = mongoose.model("Raffle", RaffleSchema);
