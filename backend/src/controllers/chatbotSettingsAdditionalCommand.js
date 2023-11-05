import pkg from "lodash";

import { ChatbotAdditionalCommandSettingModel } from "../db/chatbotAdditionalCommandSettings.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const getChatbotSettingsAdditionalCommands = async (req, res) => {
  try {
    const settings = await ChatbotAdditionalCommandSettingModel.find(
      req.query.grade === "all" ? {} : { allow: true }
    );
    return res.status(200).json({
      success: true,
      message: "Got all additional commands settings",
      data: { settings },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting all additional commands settings failed",
      data: {},
    });
  }
};

export const createChatbotSettingsAdditionalCommand = async (req, res) => {
  try {
    const command = get(req.body, "command").toString();
    const reply = get(req.body, "reply").toString();
    const allow = get(req.body, "allow");
    const st = await ChatbotAdditionalCommandSettingModel.findOne({
      command,
    });
    if (st) {
      return res.status(400).json({
        success: false,
        message: "Already exists this command",
        data: {},
      });
    }
    const newCommand = new ChatbotAdditionalCommandSettingModel({
      command,
      reply,
      allow,
    });
    await newCommand.save();
    printMessage(`new command added: ${command}`, "success");
    return res.status(200).json({
      success: true,
      message: "New additional command setting has been created",
      data: { settings: await ChatbotAdditionalCommandSettingModel.find({}) },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Creating new additional command setting failed",
      data: {},
    });
  }
};

export const updateChatbotSettingsAdditionalCommand = async (req, res) => {
  try {
    const id = get(req.body, "id").toString();
    const command = get(req.body, "command").toString();
    const reply = get(req.body, "reply").toString();
    const allow = get(req.body, "allow");

    const setting = await ChatbotAdditionalCommandSettingModel.findById(id);
    if (!setting) {
      return res.status(400).json({
        success: false,
        message: "There is no command setting with this id",
        data: {},
      });
    }

    setting.command = command;
    setting.reply = reply;
    setting.allow = allow;

    await setting.save();
    return res.status(200).json({
      success: true,
      message: "The additional command setting has been updated",
      data: { settings: await ChatbotAdditionalCommandSettingModel.find({}) },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Updaing additional command setting failed",
      data: {},
    });
  }
};

export const deleteChatbotSettingsAdditionalCommand = async (req, res) => {
  try {
    await ChatbotAdditionalCommandSettingModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({
      success: true,
      message: "Deleted additional command setting",
      data: { settings: await ChatbotAdditionalCommandSettingModel.find({}) },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Deleting additional command setting failed",
      data: {},
    });
  }
};
