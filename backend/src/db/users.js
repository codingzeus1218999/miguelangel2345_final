import mongoose from "mongoose";

const TypeItemState = ["pending", "rejected", "approved"];

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verification_token: { type: String, required: true },
  forgot_password_token: { type: String },
  allowed: { type: Boolean, required: true, default: false },
  points: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  role: { type: String, required: true, default: "user" },
  isModerator: { type: Boolean, default: false },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      date: { type: Date, default: Date.now },
      requirements: { type: Object },
      state: { type: String, enum: TypeItemState, default: "pending" },
    },
  ],
  created_at: { type: Date, required: true, default: Date.now },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getAllowedUserByEmail = (email) =>
  UserModel.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
    allowed: true,
  });

export const getUserByEmail = (email) =>
  UserModel.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

export const getUserByVerificationToken = (token) =>
  UserModel.findOne({ verification_token: token });

export const getUserByForgotPasswordToken = (token) =>
  UserModel.findOne({ forgot_password_token: token });

export const getUsersByQuery = async (query) => {
  const filter = {
    $or: [
      { name: { $regex: new RegExp(`${query.searchStr}`, "i") } },
      { email: { $regex: new RegExp(`${query.searchStr}`, "i") } },
    ],
  };
  const count = await UserModel.countDocuments(filter);
  const users = await UserModel.find(filter)
    .sort({ [query.sortField]: query.sortDir })
    .skip(query.perPage * (query.currentPage - 1))
    .limit(query.perPage);
  return { users, count };
};
