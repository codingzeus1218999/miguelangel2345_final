import axios from "axios";
import constants from "../constants";

export const registerApi = async (data) => {
  try {
    const res = await axios.post(`${constants.API_URL}/auth/register`, data);
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const verifyEmailApi = async (token) => {
  try {
    const res = await axios.get(`${constants.API_URL}/auth/verify`, {
      params: { token },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const loginApi = (data, callback1, callback2) => {
  axios
    .post(`${constants.API_URL}/auth/login`, data)
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const forgotPasswordApi = (data, callback1, callback2) => {
  axios
    .post(`${constants.API_URL}/user/forgot-password`, data)
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const verifyPwdTokenApi = (token, callback1, callback2) => {
  axios
    .get(`${constants.API_URL}/user/forgot-password`, {
      params: { token },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const resetPasswordApi = (data, callback1, callback2) => {
  axios
    .put(`${constants.API_URL}/user/reset-password`, data)
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const getUserInfoFromEmail = (email, callback1, callback2) => {
  axios
    .get(`${constants.API_URL}/user`, {
      params: { email },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const removeAvatar = (data, callback1, callback2) => {
  axios
    .put(`${constants.API_URL}/user/remove-avatar`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const uploadAvatar = (formData, callback1, callback2) => {
  axios
    .post(`${constants.API_URL}/user/upload-avatar`, formData, {
      headers: {
        Authorization: localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const updateInfo = (data, callback1, callback2) => {
  axios
    .put(`${constants.API_URL}/user/update-info`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const changePassword = (data, callback1, callback2) => {
  axios
    .put(`${constants.API_URL}/user/change-password`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const getKickInfoByName = async (id) => {
  try {
    const res = await axios.get(`${constants.KICK_API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const verifiedTwoStep = async (data) => {
  try {
    const res = await axios.put(
      `${constants.API_URL}/auth/verified-two-step`,
      data
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getItems = async () => {
  try {
    const res = await axios.get(`${constants.API_URL}/items`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getItemInfoById = async (itemId, userId) => {
  try {
    const res = await axios.get(`${constants.API_URL}/item`, {
      params: { itemId, userId },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getLatestItems = async () => {
  try {
    const res = await axios.get(`${constants.API_URL}/item/latest`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const purchaseItem = async (data) => {
  try {
    const res = await axios.put(`${constants.API_URL}/item/purchase`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getRedemptions = async (query) => {
  try {
    const res = await axios.get(`${constants.API_URL}/user/redemptions`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: query,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getCurrentServerTime = async (query) => {
  try {
    const res = await axios.get(`${constants.API_URL}/user/time`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getItemRaffleByItem = async (itemId, userId) => {
  try {
    const res = await axios.get(`${constants.API_URL}/item-raffle`, {
      params: { itemId, userId },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getUserTwitchInfo = async (code) => {
  try {
    const res = await axios.get(`${constants.API_URL}/user/twitch`, {
      params: { code },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const transferPointsFromTwitch = async (data) => {
  try {
    const res = await axios.put(`${constants.API_URL}/user/transfer`, data, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};
