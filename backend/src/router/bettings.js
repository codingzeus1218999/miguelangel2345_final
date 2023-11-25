import {
  getBettingList,
  createBetting,
  joinToBetting,
  finishBetting,
  refundBetting,
  calculateBetting,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/admin/bettings", isAuthorized, getBettingList);
  router.post("/admin/betting", isAuthorized, createBetting);
  router.put("/admin/betting/join", isAuthorized, joinToBetting);
  router.put("/admin/betting/finish", isAuthorized, finishBetting);
  router.put("/admin/betting/refund", isAuthorized, refundBetting);
  router.put("/admin/betting/calculate", isAuthorized, calculateBetting);
};
