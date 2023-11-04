import formidable from "formidable";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import pkg from "lodash";

import { ItemModel, getItemsByQuery } from "../db/items.js";
import { differenceTimes, printMessage, sendEmail } from "../utils/index.js";
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
        quantity:
          fields.info.type === "key"
            ? fields.info.codes.length
            : fields.info.quantity,
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

export const getItemList = async (req, res) => {
  try {
    const { items, count } = await getItemsByQuery(req.query);
    return res.status(200).json({
      success: true,
      data: {
        items,
        count,
      },
      message: "Got all items for admin",
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Failed to getting items for admin",
      data: {},
    });
  }
};

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

export const deleteItem = async (req, res) => {
  try {
    const item = await ItemModel.findById(req.query.id);
    if (item) {
      item.deleted = true;
      const p = await item.save();
      printMessage(`${p.name} has been deleted`, "info");
      const { items, count } = await getItemsByQuery(req.query.query);
      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
        data: { items, count },
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
    return res.status(400).json({
      success: false,
      message: "Failed to deleting item",
      data: {},
    });
  }
};

export const editItem = async (req, res) => {
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
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
          data: {},
        });
      }
      const item = await ItemModel.findOne({ _id: fields.id, deleted: false });
      if (item) {
        const {
          type,
          image,
          name,
          cost,
          coolDownGlobal,
          coolDownUser,
          codes,
          description,
          quantity,
          isNoticeInChat,
          shouldBeSubscriber,
          requirements,
          shouldDiscard,
          selectRandom,
        } = JSON.parse(fields.info);
        item.type = type;
        item.name = name;
        item.description = description;
        item.cost = cost;
        item.shouldBeSubscriber = shouldBeSubscriber;
        item.coolDownGlobal = coolDownGlobal;
        item.coolDownUser = coolDownUser;
        item.codes = codes;
        item.quantity = type === "key" ? codes.length : quantity;
        item.isNoticeInChat = isNoticeInChat;
        item.requirements = requirements;
        item.shouldDiscard = shouldDiscard;
        item.selectRandom = selectRandom;
        item.image =
          Object.keys(file).length > 0 ? file.image[0].newFilename : image;
        item
          .save()
          .then((newItem) => {
            printMessage(`${newItem.name} has been updated`, "info");
            return res.status(200).json({
              success: true,
              message: "Successfully changed",
              data: { newItem },
            });
          })
          .catch((err) => {
            printMessage(err, "error");
            return res.status(400).json({
              success: false,
              message: "Failed to changing the item",
              data: {},
            });
          });
      } else {
        return res.status(400).json({
          success: false,
          message: "There is no item with this id",
          data: {},
        });
      }
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Failed to updating item info",
      data: {},
    });
  }
};

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
    // check user cooltime
    const userHistoryTimes = item.users
      .filter((u) => u.user.toString() === userId)
      .map((u) => u.date)
      .sort((a, b) => new Date(b) - new Date(a));
    if (
      userHistoryTimes.length > 0 &&
      differenceTimes(Date.now(), userHistoryTimes?.[0]) < item.coolDownUser
    )
      return res.status(400).json({
        success: false,
        message: "You can't redeem this item in user cool down time",
        data: {},
      });
    // check global cooltime
    const globalHistoryTimes = item.users
      .map((u) => u.date)
      .sort((a, b) => new Date(b) - new Date(a));
    if (
      globalHistoryTimes.length > 0 &&
      differenceTimes(Date.now(), globalHistoryTimes?.[0]) < item.coolDownGlobal
    )
      return res.status(400).json({
        success: false,
        message: "You can't redeem this item in global cool down time",
        data: {},
      });

    if (item.quantity !== -1) item.quantity = item.quantity - 1;
    item.users = [...item.users, { user: userId }];
    user.items = [
      ...user.items,
      {
        item: itemId,
        requirements: requirements,
        state: item.type === "key" ? "approved" : "pending",
      },
    ];
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
    printMessage(`${user.name} has been purchased ${item.name}`, "success");
    sendEmail(
      user.email,
      "noticePurchasingItem",
      {
        type: item.type,
        name: item.name,
        description: item.description,
        cost: item.cost,
        codes: item.codes,
      },
      "Success in purchasing in Miguelangel2345"
    );
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

export const getRedemptionPendingList = async (req, res) => {
  try {
    const { redemptions, count } = await getRedemptions("pending", req.query);
    return res.status(200).json({
      success: true,
      data: {
        redemptions,
        count,
      },
      message: "Got all pending redemptions for admin",
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Failed to getting pending redemptions for admin",
      data: {},
    });
  }
};

export const getRedemptionHistoryList = async (req, res) => {
  try {
    const { redemptions, count } = await getRedemptions("history", req.query);
    return res.status(200).json({
      success: true,
      data: {
        redemptions,
        count,
      },
      message: "Got all redemption history for admin",
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Failed to getting redemption history for admin",
      data: {},
    });
  }
};

export const processRedemption = async (req, res) => {
  try {
    const redemptionId = get(req.body, "id").toString();
    const newState = get(req.body, "state").toString();
    const query = get(req.body, "query");

    const user = await UserModel.findOne({ "items._id": redemptionId });
    const userItems = [...user.items];
    const itemId = userItems.find(
      (t) => t._id.toString() === redemptionId
    ).item;
    const item = await ItemModel.findById(itemId);

    const p = await UserModel.findOneAndUpdate(
      { "items._id": redemptionId },
      {
        $set: {
          "items.$.state": newState,
          points:
            newState === "approved" ? user.points : user.points + item.cost,
        },
      },
      { new: true }
    );

    printMessage(`Redemption of ${p.name} has been ${newState}`, "success");

    const { redemptions, count } = await getRedemptions("pending", query);
    return res.status(200).json({
      success: true,
      data: {
        redemptions,
        count,
      },
      message: `Successfully ${newState} item`,
    });
  } catch (err) {
    printMessage(err, "error");
    return res.status(400).json({
      success: false,
      message: "Failed to process redemption",
      data: {},
    });
  }
};

const getRedemptions = async (cat, query) => {
  const searchStr = query.searchStr;
  const perPage = Number(query.perPage);
  const currentPage = Number(query.currentPage);
  const sortField = query.sortField;
  const sortDir = query.sortDir === "asc" ? 1 : -1;

  const redemptions = await UserModel.aggregate([
    {
      $unwind: "$items",
    },
    {
      $match: {
        "items.state": cat === "pending" ? "pending" : { $ne: "pending" },
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "items.item",
        foreignField: "_id",
        as: "purchasedItems",
      },
    },
    {
      $unwind: "$purchasedItems",
    },
    {
      $project: {
        _id: "$items._id",
        state: "$items.state",
        name: 1,
        email: 1,
        purchasedItem: "$purchasedItems",
        purchaseDate: "$items.date",
      },
    },
    {
      $match: {
        $or: [
          { email: { $regex: searchStr, $options: "i" } },
          { name: { $regex: searchStr, $options: "i" } },
          { "purchasedItem.name": { $regex: searchStr, $options: "i" } },
          {
            "purchasedItem.description": { $regex: searchStr, $options: "i" },
          },
        ],
      },
    },
    {
      $sort: { [sortField]: sortDir },
    },
    {
      $skip: (currentPage - 1) * perPage,
    },
    {
      $limit: perPage,
    },
  ]);

  const allRedemptions = await UserModel.aggregate([
    {
      $unwind: "$items",
    },
    {
      $match: {
        "items.state": cat === "pending" ? "pending" : { $ne: "pending" },
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "items.item",
        foreignField: "_id",
        as: "purchasedItems",
      },
    },
    {
      $unwind: "$purchasedItems",
    },
    {
      $project: {
        _id: "$items._id",
        state: "$items.state",
        name: 1,
        email: 1,
        purchasedItem: "$purchasedItems",
        purchaseDate: "$items.date",
      },
    },
    {
      $match: {
        $or: [
          { email: { $regex: searchStr, $options: "i" } },
          { name: { $regex: searchStr, $options: "i" } },
          { "purchasedItem.name": { $regex: searchStr, $options: "i" } },
          {
            "purchasedItem.description": { $regex: searchStr, $options: "i" },
          },
        ],
      },
    },
  ]);

  return {
    redemptions,
    count: allRedemptions.length,
  };
};
