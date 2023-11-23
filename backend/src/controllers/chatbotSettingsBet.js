import pkg from "lodash";

import { ChatbotBetSettingModel } from "../db/chatbotBetSettings.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const getChatbotSettingsBet = async (req, res) => {
  try {
    const setting = await ChatbotBetSettingModel.findOne();
    return res.status(200).json({
      success: true,
      message: "Got bet chatbot settings",
      data: { setting },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting bet settings failed",
      data: {},
    });
  }
};

export const createChatbotSettingsBet = async (req, res) => {
  try {
    const st = await ChatbotBetSettingModel.findOne();
    if (st) {
      return res.status(400).json({
        success: false,
        message: "Already exists these settings",
        data: { setting: st },
      });
    }
    const created = get(req.body, "created").toString();
    const joinSuccess = get(req.body, "joinSuccess").toString();
    const alreadyJoined = get(req.body, "alreadyJoined").toString();
    const notRegisteredUser = get(req.body, "notRegisteredUser").toString();
    const doneInTime = get(req.body, "doneInTime").toString();
    const doneOnTime = get(req.body, "doneOnTime").toString();
    const resultNotice = get(req.body, "resultNotice").toString();
    const distributedPoints = get(req.body, "distributedPoints").toString();
    const refundNotice = get(req.body, "refundNotice").toString();
    const betSettings = new ChatbotBetSettingModel({
      created,
      joinSuccess,
      alreadyJoined,
      notRegisteredUser,
      doneInTime,
      doneOnTime,
      resultNotice,
      distributedPoints,
      refundNotice,
    });
    betSettings
      .save()
      .then((setting) =>
        res.status(200).json({
          success: true,
          message: "Successfully created",
          data: { setting },
        })
      )
      .catch((err) => {
        printMessage(err, "error");
        return res.status(500).json({
          success: false,
          message: "Failed to saving bet setting",
          data: {},
        });
      });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to creating bet setting",
      data: {},
    });
  }
};

export const updateChatbotSettingsBet = async (req, res) => {
  try {
    const betSettings = await ChatbotBetSettingModel.findOne();
    if (betSettings) {
      const created = get(req.body, "created").toString();
      const joinSuccess = get(req.body, "joinSuccess").toString();
      const alreadyJoined = get(req.body, "alreadyJoined").toString();
      const notRegisteredUser = get(req.body, "notRegisteredUser").toString();
      const doneInTime = get(req.body, "doneInTime").toString();
      const doneOnTime = get(req.body, "doneOnTime").toString();
      const resultNotice = get(req.body, "resultNotice").toString();
      const distributedPoints = get(req.body, "distributedPoints").toString();
      const refundNotice = get(req.body, "refundNotice").toString();
      betSettings.created = created;
      betSettings.joinSuccess = joinSuccess;
      betSettings.alreadyJoined = alreadyJoined;
      betSettings.notRegisteredUser = notRegisteredUser;
      betSettings.doneInTime = doneInTime;
      betSettings.doneOnTime = doneOnTime;
      betSettings.resultNotice = resultNotice;
      betSettings.distributedPoints = distributedPoints;
      betSettings.refundNotice = refundNotice;
      betSettings
        .save()
        .then((setting) =>
          res.status(200).json({
            success: true,
            message: "Successfully updated the bet setting",
            data: { setting },
          })
        )
        .catch((err) => {
          printMessage(err, "error");
          return res.status(500).json({
            success: false,
            message: "Failed to saving bet setting",
            data: {},
          });
        });
    } else {
      printMessage(err, "error");
      return res.status(400).json({
        success: false,
        message: "There is no these setting",
        data: {},
      });
    }
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to updating bet setting",
      data: {},
    });
  }
};
