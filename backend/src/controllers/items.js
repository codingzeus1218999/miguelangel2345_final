import formidable from "formidable";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { ItemModel } from "../db/items.js";
import { printMessage } from "../utils/index.js";

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

// export const getPrizeInfoById = async (req, res) => {
//   try {
//     const prize = await PrizeModel.findById(req.query.id);
//     if (prize.deleted) {
//       return res.status(400).json({
//         success: false,
//         message: "This item was deleted",
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         prize,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };

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

// export const getPrizes = async (req, res) => {
//   try {
//     const prizes = await PrizeModel.find({ deleted: false });
//     return res.status(200).json({
//       success: true,
//       prizes,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };

// export const getPrize = async (req, res) => {
//   try {
//     const prize = await PrizeModel.findOne({
//       deleted: false,
//       _id: req.query.id,
//     });
//     if (prize) {
//       return res.status(200).json({
//         success: true,
//         prize,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "There is no prize with this id",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };

// export const getLatestPrizes = async (req, res) => {
//   try {
//     const prizes = await getLatest4();
//     return res.status(200).json({
//       success: true,
//       prizes,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(400);
//   }
// };
