import mongoose from "mongoose";

const PrizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
  description: { type: String, required: true },
  points: { type: Number, default: 0, required: true, min: 0 },
  shouldModerator: { type: Boolean, default: false, required: true },
  isLocked: { type: Boolean, default: false, required: true },
  wagerMethod: { type: String, default: "" },
  wagerMin: { type: Number, default: 0, required: true },
  wagerMax: { type: Number, default: 0, required: true },
  winners: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date },
      amount: { type: Number },
    },
  ],
  deleted: { type: Boolean, required: true, default: false },
  created_at: { type: Date, required: true, default: Date.now },
});

export const PrizeModel = mongoose.model("Prize", PrizeSchema);

export const getPrizesByQuery = async (query) => {
  const filter = {
    $or: [
      { name: { $regex: new RegExp(`${query.searchStr}`, "i") } },
      { description: { $regex: new RegExp(`${query.searchStr}`, "i") } },
    ],
    deleted: false,
  };
  const prizes = await PrizeModel.find(filter)
    .sort({ [query.sortField]: query.sortDir })
    .skip(query.perPage * (query.currentPage - 1))
    .limit(query.perPage);
  const count = await PrizeModel.countDocuments(filter);
  return { prizes, count };
};

export const getLatest4 = async () => {
  const prizes = await PrizeModel.find({ deleted: false })
    .sort({ created_at: "desc" })
    .limit(4);
  return prizes;
};
