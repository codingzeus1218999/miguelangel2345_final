import bcrypt from "bcrypt";
import pkg from "lodash";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import constants from "../constants/index.js";
import {
  UserModel,
  getAllowedUserByEmail,
  getUserByEmail,
  getUserByForgotPasswordToken,
  getUsersByQuery,
} from "../db/users.js";
import { printMessage, sendEmail } from "../utils/index.js";
import mongoose from "mongoose";

const { get } = pkg;

export const forgotPassword = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const account = await getAllowedUserByEmail(email);
    if (account) {
      const forgotPasswordToken = crypto.randomBytes(32).toString("hex");
      account.forgot_password_token = forgotPasswordToken;
      account
        .save()
        .then((user) => {
          if (
            sendEmail(
              email,
              "resetPassword",
              {
                link_url: `${constants.FRONTEND_URL}/forgot-password/${verificationToken}`,
              },
              "Did you forgot your password?"
            )
          ) {
            return res.status(200).json({
              success: true,
              message: "Email sent. Please check your mailbox",
              data: {},
            });
          } else {
            return res.status(500).json({
              success: false,
              message: "Email sending failed",
              data: {},
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.sendStatus(400);
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const forgotPasswordEmail = async (req, res) => {
  try {
    const account = await getUserByForgotPasswordToken(req.query.token);
    if (account) {
      return res
        .status(200)
        .json({ success: true, email: account.email, name: account.name });
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this token.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const newPassword = get(req.body, "password").toString();
    const account = await getAllowedUserByEmail(email);
    if (account) {
      account.password = bcrypt.hashSync(newPassword, 10);
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          message: "Password has been reset.",
          token: jwt.sign(
            { email: user.email, role: user.role },
            constants.SECRET,
            {
              expiresIn: constants.EXPIRESTIME,
            }
          ),
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getUserInfoFromEmail = async (req, res) => {
  try {
    const account = await getAllowedUserByEmail(req.query.email);
    if (account) {
      return res.status(200).json({ success: true, user: account });
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const removeAvatar = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const account = await getAllowedUserByEmail(email);
    if (account) {
      account.avatar = "";
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderName = path.join(__dirname, "../", "../", "public", "avatars");
    if (!fs.existsSync(folderName)) {
      if (!fs.existsSync(path.join(__dirname, "../", "../", "public")))
        fs.mkdirSync(path.join(__dirname, "../", "../", "public"));
      fs.mkdirSync(folderName);
    }
    const form = formidable({
      uploadDir: folderName,
      keepExtensions: true,
      multiples: false,
    });
    form.parse(req, async (err, fields, file) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      const account = await getAllowedUserByEmail(fields.email[0]);
      if (account) {
        account.avatar = file.avatar[0].newFilename;
        account.save().then((user) =>
          res.status(200).json({
            success: false,
            avatar: user.avatar,
          })
        );
      } else {
        return res.status(400).json({
          success: false,
          message: "There is no account with this email.",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateInfo = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const name = get(req.body, "name").toString();
    const bio = get(req.body, "bio").toString();
    const account = await getAllowedUserByEmail(email);
    if (account) {
      account.name = name;
      account.bio = bio;
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          name,
          bio,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const changePassword = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const oldPassword = get(req.body, "oldPassword").toString();
    const newPassword = get(req.body, "newPassword").toString();
    const account = await getAllowedUserByEmail(email);
    if (account) {
      if (!bcrypt.compareSync(oldPassword, account.password)) {
        return res.status(400).json({
          success: false,
          message: "Password is incorrect.",
        });
      }
      account.password = bcrypt.hashSync(newPassword, 10);
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          password: user.password,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getUserList = async (req, res) => {
  try {
    const { users, count } = await getUsersByQuery(req.query);
    return res.status(200).json({
      success: true,
      users,
      count,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getUserInfoById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.query.id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const password = get(req.body, "password").toString();
    const account = await getUserByEmail(email);
    if (account) {
      account.password = bcrypt.hashSync(password, 10);
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const changeUserInfo = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const name = get(req.body, "name").toString();
    const bio = get(req.body, "bio").toString();
    const account = await getUserByEmail(email);
    if (account) {
      account.name = name;
      account.bio = bio;
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const removeUserAvatar = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const account = await getUserByEmail(email);
    if (account) {
      account.avatar = "";
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          avatar: user.avatar,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const uploadUserAvatar = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderName = path.join(__dirname, "../", "../", "public", "avatars");
    if (!fs.existsSync(folderName)) {
      if (!fs.existsSync(path.join(__dirname, "../", "../", "public")))
        fs.mkdirSync(path.join(__dirname, "../", "../", "public"));
      fs.mkdirSync(folderName);
    }
    const form = formidable({
      uploadDir: folderName,
      keepExtensions: true,
      multiples: false,
    });
    form.parse(req, async (err, fields, file) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      const account = await getUserByEmail(fields.email[0]);
      if (account) {
        account.avatar = file.avatar[0].newFilename;
        account.save().then((user) =>
          res.status(200).json({
            success: false,
            avatar: user.avatar,
          })
        );
      } else {
        return res.status(400).json({
          success: false,
          message: "There is no account with this email.",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const changeUserModerator = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const moderator = get(req.body, "moderator").toString();
    const account = await getUserByEmail(email);
    if (account) {
      account.isModerator = moderator;
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
export const changeUserState = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const state = get(req.body, "state").toString();
    const account = await getUserByEmail(email);
    if (account) {
      account.allowed = state;
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
export const changeUserRole = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const role = get(req.body, "role").toString();
    const account = await getUserByEmail(email);
    if (account) {
      account.role = role;
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
        })
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const addPointsToUser = async (req, res) => {
  try {
    const name = get(req.body, "name").toString();
    const points = Number(get(req.body, "points"));
    const account = await UserModel.findOne({ allowed: true, name });
    if (account) {
      account.points = account.points + points;
      account.save().then((user) =>
        res.status(200).json({
          success: true,
          user,
          addedPoints: points,
        })
      );
    } else {
      return res.status(200).json({
        success: false,
        message: "This user is not registered.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getUserPoints = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      allowed: true,
      name: req.query.username,
    });
    if (!user) {
      return res.status(200).json({ success: false, status: "no-register" });
    }
    return res.status(200).json({ success: true, points: user.points });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const addPointsToUsersChatbot = async (req, res) => {
  try {
    const username = get(req.body, "username").toString();
    const users = get(req.body, "users").toString();
    const points = Number(get(req.body, "points"));
    const badges = get(req.body, "badges");

    const isModerator = badges.some((obj) => obj?.type === "moderator");
    const moderator = await UserModel.findOne({
      allowed: true,
      name: username,
    });

    if (!moderator || !isModerator) {
      return res.status(200).json({
        success: false,
        status: "not-allowed",
      });
    }
    if (users === "all") {
      const addRes = await UserModel.updateMany(
        { allowed: true },
        { $inc: { points: points } }
      );
      return res.status(200).json({
        success: true,
        count: addRes.modifiedCount,
      });
    } else {
      const usersToAdd = users.split(", ");
      const addRes = await UserModel.updateMany(
        { name: { $in: usersToAdd }, allowed: true },
        { $inc: { points: points } }
      );
      return res.status(200).json({
        success: true,
        count: addRes.modifiedCount,
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const delPointsToUsersChatbot = async (req, res) => {
  try {
    const username = get(req.body, "username").toString();
    const users = get(req.body, "users").toString();
    const points = Number(get(req.body, "points"));
    const badges = get(req.body, "badges");

    const isModerator = badges.some((obj) => obj?.type === "moderator");
    const moderator = await UserModel.findOne({
      allowed: true,
      name: username,
    });

    if (!moderator || !isModerator) {
      return res.status(200).json({
        success: false,
        status: "not-allowed",
      });
    }
    if (users === "all") {
      const delRes = await UserModel.updateMany({ allowed: true }, [
        { $set: { points: { $max: [0, { $subtract: ["$points", points] }] } } },
      ]);
      return res.status(200).json({
        success: true,
        count: delRes.modifiedCount,
      });
    } else {
      const usersToAdd = users.split(", ");
      const delRes = await UserModel.updateMany(
        { name: { $in: usersToAdd }, allowed: true },
        { $set: { points: { $max: [0, { $subtract: ["$points", points] }] } } }
      );
      return res.status(200).json({
        success: true,
        count: delRes.modifiedCount,
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const addPointsToUsersRaffle = async (req, res) => {
  try {
    const users = get(req.body, "users");
    const points = Number(get(req.body, "points"));

    UserModel.find({ _id: { $in: users }, allowed: true })
      .select("name")
      .then(async (us) => {
        const usernames = `@${us.map((u) => u.name).join(", @")}`;
        const addRes = await UserModel.updateMany(
          { _id: { $in: users }, allowed: true },
          { $inc: { points: points } }
        );
        return res.status(200).json({
          success: true,
          count: addRes.modifiedCount,
          usernames,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getRedemptions = async (req, res) => {
  try {
    const userId = req.query.userId;
    const searchStr = req.query.searchStr;
    const perPage = Number(req.query.perPage);
    const currentPage = Number(req.query.currentPage);
    const sortField = req.query.sortField;
    const sortDir = req.query.sortDir === "asc" ? 1 : -1;

    const redemptions = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "items",
          localField: "items.item",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      {
        $match: {
          $or: [
            { "item.name": { $regex: searchStr, $options: "i" } },
            { "item.description": { $regex: searchStr, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          _id: "$items._id",
          itemId: "$item._id",
          name: "$item.name",
          type: "$item.type",
          description: "$item.description",
          cost: "$item.cost",
          image: "$item.image",
          requirements: "$item.requirements",
          codes: "$item.codes",
          date: "$items.date",
          state: "$items.state",
        },
      },
      { $sort: { [sortField]: sortDir } },
      {
        $skip: (currentPage - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ]);

    const allRedemptions = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "items",
          localField: "items.item",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      {
        $match: {
          $or: [
            { "item.name": { $regex: searchStr, $options: "i" } },
            { "item.description": { $regex: searchStr, $options: "i" } },
          ],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        redemptions,
        count: allRedemptions.length,
      },
      message: "Got all purchased items",
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Failed to getting purchased items",
      data: {},
    });
  }
};
export const getCurrentServerTime = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get current server time",
    data: { time: Date.now() },
  });
};
