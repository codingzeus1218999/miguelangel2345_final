import pkg from "lodash";

import { ChatbotCommandSettingModel } from "../db/chatbotCommandSettings.js";

const { get } = pkg;

export const getChatbotSettingsCommand = async (req, res) => {
  try {
    const settings = await ChatbotCommandSettingModel.findOne();
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const createChatbotSettingsCommand = async (req, res) => {
  try {
    const st = await ChatbotCommandSettingModel.findOne();
    if (st) {
      return res.status(400).json({
        success: false,
        message: "Already exists these settings",
      });
    }
    const commandSettings = new ChatbotCommandSettingModel({
      ...req.body,
    });
    commandSettings
      .save()
      .then((settings) =>
        res.status(200).json({
          success: true,
          settings,
        })
      )
      .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateChatbotSettingsCommand = async (req, res) => {
  try {
    const commandSettings = await ChatbotCommandSettingModel.findOne();
    if (commandSettings) {
      const raffleStart = get(req.body, "raffleStart").toString();
      const useRaffleCommand = get(req.body, "useRaffleCommand").toString();
      const raffleJoin = get(req.body, "raffleJoin").toString();
      const raffleEnd = get(req.body, "raffleEnd").toString();
      const raffleNotReady = get(req.body, "raffleNotReady").toString();
      const raffleCant = get(req.body, "raffleCant").toString();
      const pointsRemaining = get(req.body, "pointsRemaining").toString();
      const pointsRemainingMsg = get(req.body, "pointsRemainingMsg").toString();
      const pointsRemainingNotRegistered = get(
        req.body,
        "pointsRemainingNotRegistered"
      ).toString();
      const addPointsMsg = get(req.body, "addPointsMsg").toString();
      const addPointsMsgSuccess = get(
        req.body,
        "addPointsMsgSuccess"
      ).toString();
      const addPointsMsgNotPermission = get(
        req.body,
        "addPointsMsgNotPermission"
      ).toString();
      const delPointsMsg = get(req.body, "delPointsMsg").toString();
      const delPointsMsgSuccess = get(
        req.body,
        "delPointsMsgSuccess"
      ).toString();
      const delPointsMsgNotPermission = get(
        req.body,
        "delPointsMsgNotPermission"
      ).toString();
      commandSettings.raffleStart = raffleStart;
      commandSettings.useRaffleCommand = useRaffleCommand;
      commandSettings.raffleJoin = raffleJoin;
      commandSettings.raffleEnd = raffleEnd;
      commandSettings.raffleNotReady = raffleNotReady;
      commandSettings.raffleCant = raffleCant;
      commandSettings.pointsRemaining = pointsRemaining;
      commandSettings.pointsRemainingMsg = pointsRemainingMsg;
      commandSettings.pointsRemainingNotRegistered =
        pointsRemainingNotRegistered;
      commandSettings.addPointsMsg = addPointsMsg;
      commandSettings.addPointsMsgSuccess = addPointsMsgSuccess;
      commandSettings.addPointsMsgNotPermission = addPointsMsgNotPermission;
      commandSettings.delPointsMsg = delPointsMsg;
      commandSettings.delPointsMsgSuccess = delPointsMsgSuccess;
      commandSettings.delPointsMsgNotPermission = delPointsMsgNotPermission;
      commandSettings
        .save()
        .then((settings) =>
          res.status(200).json({
            success: true,
            settings,
          })
        )
        .catch((err) => {
          console.log(err);
          return res.sendStatus(400);
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no these setting",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
