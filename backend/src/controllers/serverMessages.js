import pkg from "lodash";

import { ServerMessageModel } from "../db/serverMessages.js";

const { get } = pkg;

export const addServerMessage = async (req, res) => {
  try {
    const message = get(req.body, "message").toString();

    const serverMessage = new ServerMessageModel({
      message,
    });
    serverMessage
      .save()
      .then((message) =>
        res.status(200).json({
          success: true,
          message,
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
