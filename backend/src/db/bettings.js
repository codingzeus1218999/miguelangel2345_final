import mongoose from "mongoose";

const StateEnum = [
  "pending",
  "doneontime",
  "doneintime",
  "refunded",
  "calculating",
];

const BettingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [
    {
      case: { type: String, required: true },
      command: { type: String, required: true },
      winState: { type: Boolean, default: false },
      participants: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          time: { type: Date, default: Date.now },
          amount: { type: Number },
          prize: { type: Number },
        },
      ],
    },
  ],
  duration: { type: Number, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  state: { type: String, enum: StateEnum },
  middleState: { type: String, enum: StateEnum },
  createdAt: { type: Date, required: true, default: Date.now },
  doneAt: { type: Date },
});

export const BettingModel = mongoose.model("Betting", BettingSchema);
