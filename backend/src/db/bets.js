import mongoose from "mongoose";

const StateEnum = [
  "pending",
  "doneontime",
  "doneintime",
  "refunded",
  "calculating",
];

const BetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [
    {
      case: { type: String, required: true },
      value: { type: Number, required: true },
      command: { type: String, required: true },
      participants: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          date: { type: Date, default: Date.now },
          amount: { type: Number },
          prize: { type: Number },
        },
      ],
    },
  ],
  duration: { type: Number, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  winOption: { type: Number },
  state: { type: String, enum: StateEnum },
  createdAt: { type: Date, required: true, default: Date.now },
  doneAt: { type: Date },
});

export const BetModel = mongoose.model("Bet", BetSchema);
