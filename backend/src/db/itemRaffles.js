import mongoose from "mongoose";

const ItemRaffleSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 0 },
    },
  ],
  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  state: { type: String, default: "pending" },
  created_at: { type: Date, required: true, default: Date.now },
  end_at: { type: Date },
});

export const ItemRaffleModel = mongoose.model("ItemRaffle", ItemRaffleSchema);
