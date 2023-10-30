import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import ejs from "ejs";

import router from "./router/index.js";
import constants from "./constants/index.js";
import { printMessage } from "./utils/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use("/api", router());

app.use(express.static("public"));

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");

const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  printMessage(`Server is running on http://localhost:${port}`, "info");
});

mongoose
  .connect(constants.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    printMessage("MongoDB has been connected...", "info");
  })
  .catch((err) => {
    printMessage(err, "error");
  });
