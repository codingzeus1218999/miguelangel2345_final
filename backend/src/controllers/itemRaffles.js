import pkg from "lodash";
import { ItemRaffleModel } from "../db/itemRaffles.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const getItemRaffleByItemAdmin = async (req, res) => {
  try {
    const raffles = await ItemRaffleModel.find({
      item: req.query.itemId,
      state: "pending",
    })
      .populate({ path: "participants.user", model: "User" })
      .populate({ path: "winners", model: "User" })
      .sort({ end_at: 1 });
    return res.status(200).json({
      success: true,
      message: "Got the item raffle",
      data: {
        itemRaffle: raffles?.[0],
      },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting item raffle by item failed",
      data: {},
    });
  }
};

export const getItemRaffleByItemUser = async (req, res) => {
  try {
    const raffles = await ItemRaffleModel.find({ item: req.query.itemId })
      .populate({ path: "participants.user", model: "User" })
      .populate({ path: "winners", model: "User", select: "name" })
      .sort({ end_at: 1 });

    let thisCount = 0;
    let pastCount = 0;
    let latestWinners = [];
    let latestWinDate = null;

    for (let i = 0; i < raffles.length; i++) {
      const raffle = raffles[i];
      if (raffle.state === "done") {
        for (let j = 0; j < raffle.participants.length; j++) {
          if (raffle.participants[j].user._id.toString() === req.query.userId)
            pastCount += raffle.participants[j].count;
        }
        latestWinners = [];
        for (let k = 0; k < raffle.winners.length; k++) {
          latestWinners.push(raffle.winners[k].name);
        }
        latestWinDate = raffle.end_at;
      } else {
        for (let j = 0; j < raffle.participants.length; j++) {
          if (raffle.participants[j].user._id.toString() === req.query.userId)
            thisCount += raffle.participants[j].count;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Got the item raffle",
      data: {
        itemRaffle: { thisCount, pastCount, latestWinners, latestWinDate },
      },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting item raffle by item failed",
      data: {},
    });
  }
};

export const createItemRaffle = async (req, res) => {
  try {
    const itemId = get(req.body, "id").toString();
    const itemRaffle = await ItemRaffleModel.findOne({
      item: itemId,
      state: "pending",
    });
    if (itemRaffle) {
      return res.status(400).json({
        success: false,
        message: "There is existing pending raffle with this item",
        data: { itemRaffle },
      });
    }
    let newItemRaffle = new ItemRaffleModel({ item: itemId });
    const newRaffle = await newItemRaffle.save();
    return res.status(200).json({
      success: true,
      message: "Raffle has been created with this item",
      data: { raffleInfo: newRaffle },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Creating item raffle failed",
      data: {},
    });
  }
};

export const chooseWinners = async (req, res) => {
  try {
    const raffleId = get(req.body, "raffleId").toString();
    const winners = get(req.body, "winners");
    if (winners.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No choosed the winenrs",
        data: {},
      });
    }
    const itemRaffle = await ItemRaffleModel.findOne({
      _id: raffleId,
      state: "pending",
    });
    if (!itemRaffle) {
      return res.status(400).json({
        success: false,
        message: "There is no this item raffle",
        data: {},
      });
    }
    itemRaffle.winners = winners;
    itemRaffle.end_at = Date.now();
    itemRaffle.state = "done";
    const newRaffle = await itemRaffle.save();
    return res.status(200).json({
      success: true,
      message: "Selected the winners in item raffle",
      data: { raffleInfo: newRaffle },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Choosing winners in item raffle failed",
      data: {},
    });
  }
};
