import {
  forgotPassword,
  forgotPasswordEmail,
  resetPassword,
  getUserInfoFromEmail,
  removeAvatar,
  uploadAvatar,
  updateInfo,
  changePassword,
  getUserList,
  getUserInfoById,
  changeUserPassword,
  changeUserInfo,
  removeUserAvatar,
  uploadUserAvatar,
  changeUserModerator,
  changeUserState,
  changeUserRole,
  addPointsToUser,
  getUserPoints,
  addPointsToUsersChatbot,
  delPointsToUsersChatbot,
  addPointsToUsersRaffle,
  getRedemptions,
  getCurrentServerTime,
  getTwitchInfo,
} from "../controllers/index.js";

import { isAuthenticated, isAuthorized } from "../middlewares/index.js";

export default (router) => {
  router.get("/user/time", getCurrentServerTime);
  router.post("/user/forgot-password", forgotPassword);
  router.get("/user/forgot-password", forgotPasswordEmail);
  router.put("/user/reset-password", resetPassword);
  router.get("/user", isAuthenticated, getUserInfoFromEmail);
  router.put("/user/remove-avatar", isAuthenticated, removeAvatar);
  router.post("/user/upload-avatar", isAuthenticated, uploadAvatar);
  router.put("/user/update-info", isAuthenticated, updateInfo);
  router.put("/user/change-password", isAuthenticated, changePassword);
  router.get("/user/redemptions", isAuthenticated, getRedemptions);
  router.get("/user/twitch", isAuthenticated, getTwitchInfo);

  router.get("/admin/users", isAuthorized, getUserList);
  router.get("/admin/user", isAuthorized, getUserInfoById);
  router.get("/admin/user/points", isAuthorized, getUserPoints);
  router.put("/admin/user/change-password", isAuthorized, changeUserPassword);
  router.put("/admin/user/change-info", isAuthorized, changeUserInfo);
  router.put("/admin/user/remove-avatar", isAuthorized, removeUserAvatar);
  router.post("/admin/user/upload-avatar", isAuthorized, uploadUserAvatar);
  router.put("/admin/user/change-moderator", isAuthorized, changeUserModerator);
  router.put("/admin/user/change-state", isAuthorized, changeUserState);
  router.put("/admin/user/change-role", isAuthorized, changeUserRole);
  router.put("/admin/user/add-points", isAuthorized, addPointsToUser);
  router.put(
    "/admin/user/add-points-chatbot",
    isAuthorized,
    addPointsToUsersChatbot
  );
  router.put(
    "/admin/user/del-points-chatbot",
    isAuthorized,
    delPointsToUsersChatbot
  );
  router.put(
    "/admin/user/add-points-raffle",
    isAuthorized,
    addPointsToUsersRaffle
  );
};
