import { addServerMessage } from "../controllers/index.js";

import { isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.post("/admin/server/message", isAuthorized, addServerMessage);
};
