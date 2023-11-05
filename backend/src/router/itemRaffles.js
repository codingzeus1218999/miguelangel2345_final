import {
  getItemRaffleByItem,
  createItemRaffle,
  chooseWinners,
} from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/item-raffle", getItemRaffleByItem);
  router.post("/admin/item-raffle", isAuthorized, createItemRaffle);
  router.put("/admin/item-raffle/winners", isAuthorized, chooseWinners);
};
