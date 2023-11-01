import {
  addItem,
  getItemList,
  deleteItem,
  editItem,
  getItems,
  getItemInfoById,
  getLatestItems,
  purchaseItem,
  getRedemptionPendingList,
  getRedemptionHistoryList,
} from "../controllers/index.js";

import { isAuthorized, isAuthenticated } from "../middlewares/index.js";

export default (router) => {
  router.get("/items", getItems);
  router.get("/item", getItemInfoById);
  router.get("/item/latest", getLatestItems);
  router.put("/item/purchase", isAuthenticated, purchaseItem);

  router.post("/admin/item", isAuthorized, addItem);
  router.get("/admin/items", isAuthorized, getItemList);
  router.get("/admin/item", isAuthorized, getItemInfoById);
  router.delete("/admin/item", isAuthorized, deleteItem);
  router.put("/admin/item", isAuthorized, editItem);
  router.get("/admin/item/pending", isAuthorized, getRedemptionPendingList);
  router.get("/admin/item/history", isAuthorized, getRedemptionHistoryList);
};
