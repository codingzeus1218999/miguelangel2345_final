import jsonwebtoken from "jsonwebtoken";
import pkg from "lodash";

import constants from "../constants/index.js";

const { merge } = pkg;

export const isAuthenticated = async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.sendStatus(403);
  }
  jsonwebtoken.verify(idToken, constants.SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    }
    merge(req, { user: decoded });
    next();
  });
};

export const isAuthorized = async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.sendStatus(403);
  }
  jsonwebtoken.verify(idToken, constants.SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    }
    if (decoded.role !== "admin") {
      console.log(err);
      return res.sendStatus(403);
    }
    merge(req, { user: decoded });
    next();
  });
};
