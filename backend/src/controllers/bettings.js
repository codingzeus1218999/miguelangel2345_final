import mongoose from "mongoose";
import { BettingModel } from "../db/bettings.js";
import { UserModel } from "../db/users.js";
import { printMessage } from "../utils/index.js";

export const getBettingList = async (req, res) => {
  try {
    const bettings = await BettingModel.find({})
      .sort({ createdAt: "desc" })
      .limit(req.query.count)
      .populate("options.participants.user", "name");
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
    betting.doneAt = Date.now();
    await betting.save();
    const resultBetting = await BettingModel.findById(
      req.body.bettingId
    ).populate("options.participants.user", "name");
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
export const refundBetting = async (req, res) => {
  try {
    const betting = await BettingModel.findById(req.body.betting._id);
    if (!betting) {
      return res.status(200).json({
        success: false,
        message: "There is no betting with this id",
        data: {},
      });
    }
    if (betting.state !== "calculating") {
      return res.status(200).json({
        success: false,
        message: "This betting is already done",
        data: {},
      });
    }
    // refund points
    for (let i = 0; i < betting.options.length; i++) {
      for (let j = 0; j < betting.options[i].participants.length; j++) {
        let user = await UserModel.findById(
          betting.options[i].participants[j].user
        );
        user.points = user.points + betting.options[i].participants[j].amount;
        await user.save();
      }
    }

    betting.state = "refunded";
    await betting.save();
    const resultBetting = await BettingModel.findById(
      req.body.betting._id
    ).populate("options.participants.user", "name");
    return res.status(200).json({
      success: true,
      message: "Refunded a betting",
      data: { betting: resultBetting },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to refunding betting",
      data: {},
    });
  }
};
export const calculateBetting = async (req, res) => {
  try {
    const betting = await BettingModel.findById(req.body.betting._id);
    if (!betting) {
      return res.status(200).json({
        success: false,
        message: "There is no betting with this id",
        data: {},
      });
    }
    if (betting.state !== "calculating") {
      return res.status(200).json({
        success: false,
        message: "This betting is already done",
        data: {},
      });
    }
    // distribute the points to winners
    let allPoints = 0;
    let winnersPoints = 0;
    let winnerCount = 0;
    let winOption = "";
    for (let i = 0; i < betting.options.length; i++) {
      for (let j = 0; j < betting.options[i].participants.length; j++) {
        allPoints += betting.options[i].participants[j].amount;
        if (betting.options[i]._id.toString() === req.body.winOptionId) {
          winnersPoints += betting.options[i].participants[j].amount;
        }
      }
    }
    for (let i = 0; i < betting.options.length; i++) {
      if (betting.options[i]._id.toString() === req.body.winOptionId) {
        winnerCount = betting.options[i].participants.length;
        winOption = betting.options[i].case;
        if (winnerCount !== 0)
          for (let j = 0; j < betting.options[i].participants.length; j++) {
            let user = await UserModel.findById(
              betting.options[i].participants[j].user
            );
            user.points =
              user.points +
              (allPoints * betting.options[i].participants[j].amount) /
                winnersPoints;
            await user.save();
          }
      }
    }
    await BettingModel.updateOne(
      { _id: req.body.betting._id, "options._id": req.body.winOptionId },
      { $set: { "options.$.winState": true, state: betting.middleState } }
    );
    const resultBetting = await BettingModel.findById(
      req.body.betting._id
    ).populate("options.participants.user", "name");
    return res.status(200).json({
      success: true,
      message: "Done a betting",
      data: { betting: resultBetting, winOption, winnerCount, allPoints },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to calculating betting",
      data: {},
    });
  }
};
