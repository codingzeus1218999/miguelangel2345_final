import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "lodash";
import nodemailer from "nodemailer";
import crypto from "crypto";
import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";

import constants from "../constants/index.js";
import {
  UserModel,
  getAllowedUserByEmail,
  getUserByVerificationToken,
} from "../db/users.js";
import { printMessage } from "../utils/index.js";

const { get } = pkg;

export const signIn = async (req, res) => {
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
    const email = get(req.body, "email").toString();
    const password = get(req.body, "password").toString();
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const account = await getAllowedUserByEmail(email);
    if (account) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
        data: {},
      });
    }
    let newUser = new UserModel({
      email,
      verification_token: verificationToken,
      password: bcrypt.hashSync(password, 10),
    });
    newUser
      .save()
      .then((user) => {
        if (sendVerificationEmail(email, verificationToken)) {
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
      })
      .catch((err) => {
        printMessage(err, "error");
        return res
          .status(400)
          .json({ success: false, message: "Registeration faild", data: {} });
      });
  } catch (err) {
    printMessage(err, "error");
    return res
      .status(400)
      .json({ success: false, message: "Registeration faild", data: {} });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const account = await getUserByVerificationToken(req.query.token);
    if (account) {
      return res.status(200).json({
        success: true,
        message: "Email verified",
        data: { email: account.email },
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

const sendVerificationEmail = (email, verificationToken) => {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templateFolderName = path.join(
      __dirname,
      "../",
      "templates",
      "mails"
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: constants.VERIFICATION_MAIL_ADDRESS,
        pass: constants.VERIFICATION_MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    ejs.renderFile(
      `${templateFolderName}/registerVerification.ejs`,
      { link_url: `${constants.FRONTEND_URL}/verify/${verificationToken}` },
      (err, html) => {
        if (err) {
          printMessage("Email sending failed: " + err, "error");
          resolve(false);
        } else {
          const mailOptions = {
            from: constants.VERIFICATION_MAIL_ADDRESS,
            to: email,
            subject: "Email verification",
            html: html,
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              printMessage("Email sending failed: " + err, "error");
              resolve(false);
            } else {
              printMessage(
                "Verification email sent: " + info?.accepted?.[0],
                "success"
              );
              resolve(true);
            }
          });
        }
      }
    );
  });
};
