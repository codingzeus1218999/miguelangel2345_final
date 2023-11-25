import {
  getBettingList,
  createBetting,
  joinToBetting,
  // doneRaffle,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/admin/bettings", isAuthorized, getBettingList);
  router.post("/admin/betting", isAuthorized, createBetting);
  router.put("/admin/betting/join", isAuthorized, joinToBetting);
  // router.put("/admin/raffle/done", isAuthorized, doneRaffle);
};
