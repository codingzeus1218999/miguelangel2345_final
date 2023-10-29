import {
  signUp,
  signIn,
  verifyEmail,
  signInAdmin,
  verifiedTwoStep,
} from "../controllers/index.js";

export default (router) => {
  router.post("/auth/login", signIn);
  router.post("/auth/register", signUp);
  router.get("/auth/verify", verifyEmail);
  router.put("/auth/verified-two-step", verifiedTwoStep);

  router.post("/admin/auth/login", signInAdmin);
};
