import pkg from "lodash";

import { BettingModel } from "../db/bettings.js";
import { UserModel } from "../db/users.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const getBettingList = async (req, res) => {
  try {
    const bettings = await BettingModel.find({})
      .sort({ createdAt: "desc" })
      .limit(req.query.count);
    return res.status(200).json({
      success: true,
      data: { bettings },
      message: `Got ${req.query.count} betting`,
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting bettings failed",
      data: {},
    });
  }
};

export const createBetting = async (req, res) => {
  try {
    const newBetting = new BettingModel({ ...req.body, state: "pending" });
    newBetting
      .save()
      .then((betting) =>
        res.status(200).json({
          success: true,
          message: "Successfully created new betting",
          data: { betting },
        })
      )
      .catch((err) => {
        printMessage(err, "error");
        return res.status(500).json({
          success: false,
          message: "Failed to saving new betting",
          data: {},
        });
      });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to creating new betting",
      data: {},
    });
  }
};

export const joinToBetting = async (req, res) => {
  try {
    let { id, username, caseBetting, points } = req.body;
    points = Number(points);
    // check if registered user
    const user = await UserModel.findOne({
      name: username,
      allowed: true,
    });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Not registered user",
        data: { status: "not-registered" },
      });
    }
    const userId = user._id;
    // check if already joined
    const joinedBetting = await BettingModel.findOne({
      _id: id,
      "options.participants.user": userId,
    });
    if (joinedBetting) {
      return res.status(200).json({
        success: false,
        message: "You already joined",
        data: { status: "already-joined" },
      });
    }
    // check points amount
    const betting = await BettingModel.findById(id);
    if (betting.maxAmount < points || betting.minAmount > points) {
      return res.status(200).json({
        success: false,
        message: "Invalid points amount",
        data: { status: "invalid-points" },
      });
    }
    // check if user have enough points
    if (user.points < points) {
      return res.status(200).json({
        success: false,
        message: "You don't have enough points",
        data: { status: "not-enough-points" },
      });
    }
    user.points = user.points - points;
    await user.save();
    const resultBetting = await BettingModel.findOneAndUpdate(
      { _id: id, "options.case": caseBetting },
      { $push: { "options.$.participants": { user: userId, amount: points } } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully joined",
      data: { betting: resultBetting },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed joining to betting",
      data: {},
    });
  }
};

export const finishBetting = async (req, res) => {
  try {
    const betting = await BettingModel.findById(req.body.bettingId);
    if (!betting) {
      return res.status(200).json({
        success: false,
        message: "There is no betting with this id",
        data: {},
      });
    }
    if (betting.state !== "pending") {
      return res.status(200).json({
        success: false,
        message: "This betting is already done",
        data: {},
      });
    }
    betting.state = "calculating";
    betting.middleState = req.body.doneMode;
    const resultBetting = await betting.save();
    return res.status(200).json({
      success: true,
      message: "Done a betting",
      data: { betting: resultBetting },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to finishing betting",
      data: {},
    });
  }
};
