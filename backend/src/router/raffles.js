import {
  getRaffleList,
  createRaffle,
  addUserToRaffle,
  doneRaffle,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/admin/raffles", isAuthorized, getRaffleList);
  router.post("/admin/raffle", isAuthorized, createRaffle);
  router.put("/admin/raffle/add-user", isAuthorized, addUserToRaffle);
  router.put("/admin/raffle/done", isAuthorized, doneRaffle);
};
