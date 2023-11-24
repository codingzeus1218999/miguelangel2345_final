import pkg from "lodash";
import { ItemRaffleModel } from "../db/itemRaffles.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const getItemRaffleByItem = async (req, res) => {
  try {
    const raffles = await ItemRaffleModel.find(
      req.query.state === "all"
        ? { item: req.query.itemId }
        : {
            item: req.query.itemId,
            state: req.query.state,
          }
    )
      .populate({ path: "participants.user", model: "User" })
      .populate({ path: "winners", model: "User" })
      .sort({ end_at: 1 });
    return res.status(200).json({
      success: true,
      message: "Got the item raffle",
      data: {
        itemRaffle: req.query.state === "pending" ? raffles?.[0] : raffles,
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
