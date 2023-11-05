import pkg from "lodash";

import { ChatbotTimerSettingModel } from "../db/chatbotTimerSettings.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const getChatbotSettingsTimers = async (req, res) => {
  try {
    const timers = await ChatbotTimerSettingModel.find(
      req.query.grade === "all" ? {} : { allow: true }
    );
    return res.status(200).json({
      success: true,
      message: "Got all timer settings",
      data: { timers },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting all timer settings failed",
      data: {},
    });
  }
};

export const createChatbotSettingsTimer = async (req, res) => {
  try {
    const name = get(req.body, "name").toString();
    const message = get(req.body, "message").toString();
    const duration = get(req.body, "duration");
    const allow = get(req.body, "allow");
    const st = await ChatbotTimerSettingModel.findOne({
      name,
    });
    if (st) {
      return res.status(400).json({
        success: false,
        message: "Already exists this timer",
        data: {},
      });
    }
    const newTimer = new ChatbotTimerSettingModel({
      name,
      message,
      duration,
      allow,
    });
    await newTimer.save();
    printMessage(`new timer added: ${name}`, "success");
    return res.status(200).json({
      success: true,
      message: "New timer setting has been created",
      data: { timers: await ChatbotTimerSettingModel.find({}) },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Creating new timer setting failed",
      data: {},
    });
  }
};

export const updateChatbotSettingsTimer = async (req, res) => {
  try {
    const name = get(req.body, "name").toString();
    const message = get(req.body, "message").toString();
    const duration = get(req.body, "duration");
    const allow = get(req.body, "allow");

    const temp = await ChatbotTimerSettingModel.findOne({
      name: name,
      _id: { $ne: id },
    });
    if (temp) {
      return res.status(400).json({
        success: false,
        message: "Already exists same timer",
        data: {},
      });
    }

    const timer = await ChatbotTimerSettingModel.findById(id);
    if (!timer) {
      return res.status(400).json({
        success: false,
        message: "There is no timer setting with this id",
        data: {},
      });
    }

    timer.name = name;
    timer.message = message;
    timer.duration = duration;
    timer.allow = allow;

    await timer.save();
    return res.status(200).json({
      success: true,
      message: "The timer setting has been updated",
      data: { timers: await ChatbotTimerSettingModel.find({}) },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Updaing timer setting failed",
      data: {},
    });
  }
};

export const deleteChatbotSettingsTimer = async (req, res) => {
  try {
    await ChatbotTimerSettingModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({
      success: true,
      message: "Deleted timer setting",
      data: { timers: await ChatbotTimerSettingModel.find({}) },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Deleting timer setting failed",
      data: {},
    });
  }
};
