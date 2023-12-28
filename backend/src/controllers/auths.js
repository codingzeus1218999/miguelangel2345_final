import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "lodash";
import crypto from "crypto";

import constants from "../constants/index.js";
import { UserModel, getAllowedUserByEmail } from "../db/users.js";
import { printMessage, sendEmail } from "../utils/index.js";

const { get } = pkg;

export const signIn = async (req, res) => {
  try {
    const email = get(req.body, "email").toString().toLowerCase();
    const password = get(req.body, "password").toString();
    const account = await UserModel.findOne({ email, allowed: true });
    if (!account || !bcrypt.compareSync(password, account.password)) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed. Invalid user or password.",
      });
    }
    return res.status(200).json({
      success: true,
      token: jwt.sign(
        { email: account.email, role: account.role },
        constants.SECRET,
        {
          expiresIn: get(req.body, "rememberMe")
            ? constants.EXPIRESFOREVERTIME
            : constants.EXPIRESTIME,
        }
      ),
      user: account,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const signUp = async (req, res) => {
  try {
    const email = get(req.body, "email").toString().toLowerCase();
    const password = get(req.body, "password").toString();
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const accountWithThisEmail = await UserModel.findOne({ email });
    let user;

    if (accountWithThisEmail) {
      if (accountWithThisEmail.allowed) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists.",
          data: {},
        });
      } else {
        accountWithThisEmail.verification_token = verificationToken;
        accountWithThisEmail.password = bcrypt.hashSync(password, 10);
        user = await accountWithThisEmail.save();
      }
    } else {
      newUser = new UserModel({
        email,
        verification_token: verificationToken,
        password: bcrypt.hashSync(password, 10),
      });
      user = await newUser.save();
    }
    if (
      sendEmail(
        email,
        "registerVerification",
        {
          link_url: `${constants.FRONTEND_URL}/verify/${verificationToken}`,
        },
        "Email verification"
      )
    ) {
      printMessage(`${user.email} wants to register`, "info");
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
  } catch (err) {
    printMessage(err, "error");
    return res
      .status(400)
      .json({ success: false, message: "Registeration faild", data: {} });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const account = await UserModel.findOne({
      verification_token: req.query.token,
    });
    account.emailVerified = true;
    const newAccount = await account.save();
    if (newAccount) {
      return res.status(200).json({
        success: true,
        message: "Email verified",
        data: { email: newAccount.email },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no account with this token.",
        data: {},
      });
    }
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Verify email failed",
      data: {},
    });
  }
};

export const signInAdmin = async (req, res) => {
  try {
    const email = get(req.body, "email").toString();
    const password = get(req.body, "password").toString();
    const account = await getAllowedUserByEmail(email);
    if (!account || !bcrypt.compareSync(password, account.password)) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed. Invalid user or password.",
      });
    }
    if (account.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission.",
      });
    }
    return res.status(200).json({
      success: true,
      token: jwt.sign(
        { email: account.email, role: account.role },
        constants.SECRET,
        {
          expiresIn: get(req.body, "rememberMe")
            ? constants.EXPIRESFOREVERTIME
            : constants.EXPIRESTIME,
        }
      ),
      user: account,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const verifiedTwoStep = async (req, res) => {
  const name = get(req.body, "name");
  const token = get(req.body, "token");

  const user = await UserModel.findOne({
    verification_token: token,
    emailVerified: true,
  });

  const sameUser = await UserModel.findOne({
    name: name,
    allowed: true,
  });

  if (sameUser)
    return res.status(400).json({
      success: false,
      message: "Already exists same kick user name",
      data: {},
    });

  if (user) {
    user.name = name;
    user.allowed = true;
    user
      .save()
      .then((account) => {
        printMessage(`${name} has been verified two steps`, "success");
        return res.status(200).json({
          success: true,
          message: "Successfully verified your email and kick name",
          data: {
            token: jwt.sign({ email: account.email }, constants.SECRET, {
              expiresIn: constants.EXPIRESTIME,
            }),
            userId: account._id,
          },
        });
      })
      .catch((err) => {
        printMessage(err, "error");
        return res.status(400).json({
          success: false,
          message: "Failed saving the username",
          data: {},
        });
      });
  } else {
    return res.status(400).json({
      success: false,
      message: "There is no user with this token",
      data: {},
    });
  }
};
