import pkg from "lodash";

import { RaffleModel } from "../db/raffles.js";
import { UserModel } from "../db/users.js";

const { get } = pkg;

export const getRaffleList = async (req, res) => {
  try {
    const raffles = await RaffleModel.find({})
      .sort({ created_at: "desc" })
      .limit(req.query.count);
    return res.status(200).json({
      success: true,
      raffles,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const createRaffle = async (req, res) => {
  try {
    const r = await RaffleModel.findOne({ state: "pending" });
    if (r) {
      return res.status(400).json({
        success: false,
        message: "Already exists pending raffle",
      });
    }
    const name = get(req.body, "name").toString();
    const points = parseInt(get(req.body, "points"));
    const time = parseInt(get(req.body, "time"));
    const winnerCount = parseInt(get(req.body, "winnerCount"));
    const newRaffle = new RaffleModel({
      name,
      points,
      time,
      winnerCount,
    });
    newRaffle
      .save()
      .then((raffle) =>
        res.status(200).json({
          success: true,
          raffle,
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

export const addUserToRaffle = async (req, res) => {
  try {
    const r = await RaffleModel.findOne({ state: "pending" });
    if (!r) {
      return res.status(200).json({
        success: false,
        status: "not-ready",
      });
    }
    const username = get(req.body, "username").toString();
    const user = await UserModel.findOne({ name: username, allowed: true });
    if (!user) {
      return res.status(200).json({
        success: false,
        status: "no-register",
      });
    }
    if (user && !r.participants.includes(user._id)) {
      r.participants = [...r.participants, user._id];
      r.save()
        .then((raffle) =>
          res.status(200).json({
            success: true,
            raffle,
          })
        )
        .catch((err) => {
          console.log(err);
          return res.sendStatus(400);
        });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const doneRaffle = async (req, res) => {
  try {
    const raffle = get(req.body, "raffle");
    const rf = await RaffleModel.findById(raffle._id);
    if (rf.state === "done") {
      return res.status(200).json({
        success: false,
        status: "done",
      });
    }
    if (rf.state === "pending") {
      if (rf.winnerCount >= rf.participants.length) {
        rf.winners = [...rf.participants];
      } else {
        async function selectRandomUsers() {
          const selected = [];
          while (selected.length < rf.winnerCount) {
            const randomIndex = Math.floor(
              Math.random() * rf.participants.length
            );
            const randomUser = rf.participants[randomIndex];
            if (!selected.includes(randomUser)) {
              selected.push(randomUser);
            }
          }
          return selected;
        }
        (async function () {
          const selectedUsers = await selectRandomUsers();
          rf.winners = [...selectedUsers];
        })();
      }
      rf.state = "done";
      rf.save()
        .then((r) =>
          res.status(200).json({
            success: true,
            raffle: r,
          })
        )
        .catch((err) => {
          console.log(err);
          return res.sendStatus(400);
        });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
