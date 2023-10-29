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

export const getPrizes = async () => {
  try {
    const res = await axios.get(`${constants.API_URL}/prizes`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPrizeInfoById = async (id) => {
  try {
    const res = await axios.get(`${constants.API_URL}/prize`, {
      params: { id },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getLatestPrizes = async () => {
  try {
    const res = await axios.get(`${constants.API_URL}/prize/latest`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
