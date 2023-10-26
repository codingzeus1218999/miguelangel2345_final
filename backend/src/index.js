import express from "express";
import http from "http";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

import router from "./router/index.js";
import constants from "./constants/index.js";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../", "build")));
app.use(express.static("public"));
app.get("*", async (req, res) => {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});

const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose
  .connect(constants.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB has been connected...");
  })
  .catch((err) => {
    console.log(err);
  });
