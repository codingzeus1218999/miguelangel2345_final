import {
  signUp,
  signIn,
  verifyEmail,
  signInAdmin,
} from "../controllers/index.js";

export default (router) => {
  router.post("/auth/login", signIn);
  router.post("/auth/register", signUp);
  router.get("/auth/verify", verifyEmail);

  router.post("/admin/auth/login", signInAdmin);
};
