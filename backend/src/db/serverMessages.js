import mongoose from "mongoose";

const ServerMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});

export const ServerMessageModel = mongoose.model(
  "ServerMessage",
  ServerMessageSchema
);
