import {
  addPrize,
  getPrizeList,
  getPrizeInfoById,
  deletePrize,
  editPrize,
  getPrizes,
  getPrize,
  getLatestPrizes,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/prizes", getPrizes);
  router.get("/prize", getPrize);
  router.get("/prize/latest", getLatestPrizes);

  router.post("/admin/prize", isAuthorized, addPrize);
  router.get("/admin/prizes", isAuthorized, getPrizeList);
  router.get("/admin/prize", isAuthorized, getPrizeInfoById);
  router.delete("/admin/prize", isAuthorized, deletePrize);
  router.put("/admin/prize", isAuthorized, editPrize);
};
