import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import ejs from "ejs";
import colors from "colors";

import constants from "../constants/index.js";

export const printMessage = (msg, state = "info") => {
  switch (state) {
    case "success":
      console.log(`${msg}`.bgWhite.green);
      break;
    case "info":
      console.log(`${msg}`.bgWhite.blue);
      break;
    case "warning":
      console.log(`${msg}`.bgWhite.yellow);
      break;
    case "error":
      console.log(`${msg}`.bgYellow.red);
      break;
    default:
      console.log(`${msg}`);
      break;
  }
};

export const sendEmail = (email, template, emailData, emailSubject) => {
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
      `${templateFolderName}/${template}.ejs`,
      emailData,
      (err, html) => {
        if (err) {
          printMessage("Email sending failed: " + err, "error");
          resolve(false);
        } else {
          const mailOptions = {
            from: constants.VERIFICATION_MAIL_ADDRESS,
            to: email,
            subject: emailSubject,
            html: html,
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              printMessage("Email sending failed: " + err, "error");
              resolve(false);
            } else {
              printMessage("Email sent: " + info?.accepted?.[0], "success");
              resolve(true);
            }
          });
        }
      }
    );
  });
};

export const differenceTimes = (first, second) => {
  return (
    Math.abs(new Date(first).getTime() - new Date(second).getTime()) / 1000
  );
};
