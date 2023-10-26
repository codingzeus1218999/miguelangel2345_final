import pkg from "lodash";

import { ChatbotGeneralSettingModel } from "../db/chatbotGeneralSettings.js";

const { get } = pkg;

export const getChatbotSettingsGeneral = async (req, res) => {
  try {
    const settings = await ChatbotGeneralSettingModel.findOne();
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const createChatbotSettingsGeneral = async (req, res) => {
  try {
    const st = await ChatbotGeneralSettingModel.findOne();
    if (st) {
      return res.status(400).json({
        success: false,
        message: "Already exists these settings",
      });
    }
    const channel1 = get(req.body, "channel1").toString();
    const channel2 = get(req.body, "channel2").toString();
    const ws_end_point = get(req.body, "wsEndPoint").toString();
    const description = get(req.body, "description")?.toString();
    const time_duration = get(req.body, "timeDuration");
    const points_unit = get(req.body, "pointsUnit");
    const subscriber_multiple = get(req.body, "subscriberMultiple");
    const subscriber_points = get(req.body, "subscriberPoints");
    const email = get(req.body, "email");
    const password = get(req.body, "password");
    const generalSettings = new ChatbotGeneralSettingModel({
      channel1,
      channel2,
      ws_end_point,
      description,
      time_duration,
      points_unit,
      subscriber_multiple,
      subscriber_points,
      email,
      password,
    });
    generalSettings
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

export const updateChatbotSettingsGeneral = async (req, res) => {
  try {
    const generalSettings = await ChatbotGeneralSettingModel.findOne();
    if (generalSettings) {
      const channel1 = get(req.body, "channel1").toString();
      const channel2 = get(req.body, "channel2").toString();
      const wsEndPoint = get(req.body, "wsEndPoint").toString();
      const description = get(req.body, "description")?.toString();
      const timeDuration = get(req.body, "timeDuration");
      const pointsUnit = get(req.body, "pointsUnit");
      const subscriberMultiple = get(req.body, "subscriberMultiple");
      const subscriberPoints = get(req.body, "subscriberPoints");
      const email = get(req.body, "email");
      const password = get(req.body, "password");
      generalSettings.channel1 = channel1;
      generalSettings.channel2 = channel2;
      generalSettings.ws_end_point = wsEndPoint;
      generalSettings.description = description;
      generalSettings.time_duration = timeDuration;
      generalSettings.points_unit = pointsUnit;
      generalSettings.subscriber_multiple = subscriberMultiple;
      generalSettings.subscriber_points = subscriberPoints;
      generalSettings.email = email;
      generalSettings.password = password;
      generalSettings
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
