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
    await BettingModel.updateMany(
      { state: "pending" },
      { state: "doneunexpect" }
    );
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

// export const addUserToRaffle = async (req, res) => {
//   try {
//     const r = await RaffleModel.findOne({ state: "pending" });
//     if (!r) {
//       return res.status(200).json({
//         success: false,
//         status: "not-ready",
//       });
//     }
//     const username = get(req.body, "username").toString();
//     const user = await UserModel.findOne({ name: username, allowed: true });
//     if (!user) {
//       return res.status(200).json({
//         success: false,
//         status: "no-register",
//       });
//     }
//     if (user && !r.participants.includes(user._id)) {
//       r.participants = [...r.participants, user._id];
//       r.save()
//         .then((raffle) =>
//           res.status(200).json({
//             success: true,
//             raffle,
//           })
//         )
//         .catch((err) => {
//           console.log(err);
//           return res.sendStatus(400);
//         });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };

// export const doneRaffle = async (req, res) => {
//   try {
//     const raffle = get(req.body, "raffle");
//     const rf = await RaffleModel.findById(raffle._id);
//     if (rf.state === "done") {
//       return res.status(200).json({
//         success: false,
//         status: "done",
//       });
//     }
//     if (rf.state === "pending") {
//       if (rf.winnerCount >= rf.participants.length) {
//         rf.winners = [...rf.participants];
//       } else {
//         async function selectRandomUsers() {
//           const selected = [];
//           while (selected.length < rf.winnerCount) {
//             const randomIndex = Math.floor(
//               Math.random() * rf.participants.length
//             );
//             const randomUser = rf.participants[randomIndex];
//             if (!selected.includes(randomUser)) {
//               selected.push(randomUser);
//             }
//           }
//           return selected;
//         }
//         (async function () {
//           const selectedUsers = await selectRandomUsers();
//           rf.winners = [...selectedUsers];
//         })();
//       }
//       rf.state = "done";
//       rf.save()
//         .then((r) =>
//           res.status(200).json({
//             success: true,
//             raffle: r,
//           })
//         )
//         .catch((err) => {
//           console.log(err);
//           return res.sendStatus(400);
//         });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };
