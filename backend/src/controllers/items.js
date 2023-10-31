import formidable from "formidable";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import pkg from "lodash";

import { ItemModel } from "../db/items.js";
import { printMessage } from "../utils/index.js";
import { UserModel } from "../db/users.js";
const { get } = pkg;

export const addItem = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderName = path.join(__dirname, "../", "../", "public", "items");
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
        printMessage(err, "error");
        return res.status(500).json({
          success: false,
          message: "Failed that upload logo image",
          data: {},
        });
      }
      let newItem = new ItemModel({
        ...JSON.parse(fields.info),
        image: Object.keys(file).length > 0 ? file.image[0].newFilename : "",
      });
      newItem
        .save()
        .then((item) => {
          printMessage(`${item.name} item has been added`, "success");
          return res.status(200).json({
            success: true,
            data: { item },
            message: "Successfuly added new item",
          });
        })
        .catch((err) => {
          printMessage(err, "error");
          return res.status(500).json({
            success: false,
            data: {},
            message: "Failed to add new item",
          });
        });
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      data: {},
      message: "Failed to add new item",
    });
  }
};

// export const getPrizeList = async (req, res) => {
//   try {
//     const { prizes, count } = await getPrizesByQuery(req.query);
//     return res.status(200).json({
//       success: true,
//       prizes,
//       count,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };

export const getItemInfoById = async (req, res) => {
  try {
    const item = await ItemModel.findOne({ _id: req.query.id, deleted: false });
    if (item) {
      return res.status(200).json({
        success: true,
        message: "Get item info by id",
        data: { item },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "There is no item with this id",
        data: {},
      });
    }
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting item in backend failed",
      data: {},
    });
  }
};

// export const deletePrize = async (req, res) => {
//   try {
//     const prize = await PrizeModel.findById(req.query.id);
//     if (prize) {
//       prize.deleted = true;
//       const p = await prize.save();
//       const { prizes, count } = await getPrizesByQuery(req.query.query);
//       return res.status(200).json({
//         success: true,
//         prizes,
//         count,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "There is no prize with this id",
//       });
//     }
//   } catch (err) {
//     return res.sendStatus(400);
//   }
// };

// export const editPrize = async (req, res) => {
//   try {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     const folderName = path.join(__dirname, "../", "../", "public", "prizes");
//     if (!fs.existsSync(folderName)) {
//       if (!fs.existsSync(path.join(__dirname, "../", "../", "public")))
//         fs.mkdirSync(path.join(__dirname, "../", "../", "public"));
//       fs.mkdirSync(folderName);
//     }
//     const form = formidable({
//       uploadDir: folderName,
//       keepExtensions: true,
//       multiples: false,
//     });
//     form.parse(req, async (err, fields, file) => {
//       if (err) {
//         console.log(err);
//         return res.sendStatus(400);
//       }
//       const prize = await PrizeModel.findById(fields.id);
//       if (prize) {
//         const {
//           image,
//           name,
//           description,
//           points,
//           shouldModerator,
//           isLocked,
//           wagerMethod,
//           wagerMin,
//           wagerMax,
//         } = JSON.parse(fields.info);
//         prize.name = name;
//         prize.description = description;
//         prize.points = points;
//         prize.shouldModerator = shouldModerator;
//         prize.isLocked = isLocked;
//         prize.wagerMethod = wagerMethod;
//         prize.wagerMin = wagerMin;
//         prize.wagerMax = wagerMax;
//         prize.image =
//           Object.keys(file).length > 0 ? file.image[0].newFilename : image;
//         prize
//           .save()
//           .then((prize) => {
//             return res.status(200).json({ success: true, prize });
//           })
//           .catch((err) => {
//             console.log(err);
//             return res.sendStatus(400);
//           });
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: "There is no prize with this id",
//         });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };

export const getItems = async (req, res) => {
  try {
    const items = await ItemModel.find({ deleted: false });
    return res.status(200).json({
      success: true,
      message: "Get items for store front",
      data: { items },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to get items",
      data: {},
    });
  }
};

export const getLatestItems = async (req, res) => {
  try {
    const items = await ItemModel.find({ deleted: false })
      .sort({ createdAt: "desc" })
      .limit(5);
    return res.status(200).json({
      success: true,
      message: "Get latest 5 items",
      data: { items },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Getting latest items failed",
      data: {},
    });
  }
};

export const purchaseItem = async (req, res) => {
  try {
    const itemId = get(req.body, "itemId").toString();
    const userId = get(req.body, "userId").toString();
    const requirements = JSON.parse(get(req.body, "requirements").toString());
    const item = await ItemModel.findOne({ _id: itemId, deleted: false });
    const user = await UserModel.findOne({ _id: userId, allowed: true });
    if (!item)
      return res.status(500).json({
        success: false,
        message: "There is no item with this id",
        data: {},
      });
    if (!user)
      return res.status(500).json({
        success: false,
        message: "There is no user with this id",
        data: {},
      });
    if (item.quantity < -1 || item.quantity === 0)
      return res.status(400).json({
        success: false,
        message: "Balance is low",
        data: {},
      });
    if (item.cost > user.points)
      return res.status(400).json({
        success: false,
        message: "Your points is low",
        data: {},
      });
    if (
      item.type === "redeem" &&
      item.requirements.filter(
        (r) =>
          requirements[`${r}`] === undefined ||
          requirements[`${r}`].trim() === ""
      ).length > 0
    )
      return res.status(400).json({
        success: false,
        message: "Please fill the requirement infos",
        data: {},
      });
    if (item.quantity !== -1) item.quantity = item.quantity - 1;
    user.items = [...user.items, { item: itemId, requirements: requirements }];
    user.points = user.points - item.cost;
    const newItem = await item.save();
    const newUser = await user.save();
    if (!newItem)
      return res.status(400).json({
        success: false,
        message: "Saving item change failed",
        data: {},
      });
    if (!newUser)
      return res.status(400).json({
        success: false,
        message: "Saving user change failed",
        data: {},
      });
    return res.status(200).json({
      success: true,
      message: `Successfully purchased ${newItem.name}`,
      data: { newItem, newUser },
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to purchasing item",
      data: {},
    });
  }
};
