import {
  addItem,
  getItemList,
  deleteItem,
  editItem,
  getItems,
  getItemInfoByIdUser,
  getItemInfoByIdAdmin,
  getLatestItems,
  purchaseItem,
  getRedemptionPendingList,
  getRedemptionHistoryList,
  processRedemption,
} from "../controllers/index.js";

import { isAuthorized, isAuthenticated } from "../middlewares/index.js";

export default (router) => {
  router.get("/items", getItems);
  router.get("/item", getItemInfoByIdUser);
  router.get("/item/latest", getLatestItems);
  router.put("/item/purchase", isAuthenticated, purchaseItem);

  router.post("/admin/item", isAuthorized, addItem);
  router.get("/admin/items", isAuthorized, getItemList);
  router.get("/admin/item", isAuthorized, getItemInfoByIdAdmin);
  router.delete("/admin/item", isAuthorized, deleteItem);
  router.put("/admin/item", isAuthorized, editItem);
  router.put("/admin/item/process", isAuthorized, processRedemption);
  router.get("/admin/item/pending", isAuthorized, getRedemptionPendingList);
  router.get("/admin/item/history", isAuthorized, getRedemptionHistoryList);
};
