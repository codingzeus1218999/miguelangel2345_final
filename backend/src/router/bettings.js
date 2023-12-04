import {
  getBetting,
  getBettingList,
  createBetting,
  joinToBetting,
  finishBetting,
  refundBetting,
  calculateBetting,
  getLatestBetting,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/admin/bettings", isAuthorized, getBettingList);
  router.get("/admin/betting/latest", isAuthorized, getLatestBetting);
  router.get("/admin/betting", isAuthorized, getBetting);
  router.post("/admin/betting", isAuthorized, createBetting);
  router.put("/admin/betting/join", isAuthorized, joinToBetting);
  router.put("/admin/betting/finish", isAuthorized, finishBetting);
  router.put("/admin/betting/refund", isAuthorized, refundBetting);
  router.put("/admin/betting/calculate", isAuthorized, calculateBetting);
};
