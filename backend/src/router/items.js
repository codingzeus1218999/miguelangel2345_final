import {
  addItem,
  // getPrizeList,
  // deletePrize,
  // editPrize,
  getItems,
  getItemInfoById,
  getLatestItems,
  purchaseItem,
} from "../controllers/index.js";

import { isAuthorized, isAuthenticated } from "../middlewares/index.js";

export default (router) => {
  router.get("/items", getItems);
  router.get("/item", getItemInfoById);
  router.get("/item/latest", getLatestItems);
  router.put("/item/purchase", isAuthenticated, purchaseItem);

  router.post("/admin/item", isAuthorized, addItem);
  // router.get("/admin/prizes", isAuthorized, getPrizeList);
  // router.get("/admin/prize", isAuthorized, getPrizeInfoById);
  // router.delete("/admin/prize", isAuthorized, deletePrize);
  // router.put("/admin/prize", isAuthorized, editPrize);
};
