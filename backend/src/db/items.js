import mongoose from "mongoose";

const TypeEnum = ["redeem", "key", "raffle"];

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: TypeEnum },
  description: { type: String },
  cost: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, default: -1 },
  coolDownGlobal: { type: Number, default: 0 },
  coolDownUser: { type: Number, default: 0 },
  image: { type: String, default: "" },
  isNoticeInChat: { type: Boolean, default: false },
  shouldBeSubscriber: { type: Boolean, default: false },
  requirements: [{ type: String }],
  codes: [{ type: String }],
  shouldDiscard: { type: Boolean, default: false },
  selectRandom: { type: Boolean, default: false },
  deleted: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const ItemModel = mongoose.model("Item", ItemSchema);
