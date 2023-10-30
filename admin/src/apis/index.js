import axios from "axios";
import constants from "../constants";

export const loginApi = (data, callback1, callback2) => {
  axios
    .post(`${constants.ADMIN_API_URL}/auth/login`, data)
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const getUserInfoFromEmail = (email, callback1, callback2) => {
  axios
    .get(`${constants.BASE_API_URL}/user`, {
      params: { email },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => callback1(res))
    .catch((err) => callback2(err));
};

export const getUserList = async (query) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/users`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: query,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserInfoById = async (id) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/user`, {
      params: { id },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const changeUserPassword = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/user/change-password`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const changeUserInfo = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/user/change-info`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const removeUserAvatar = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/user/remove-avatar`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const uploadUserAvatar = async (formData) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/user/upload-avatar`,
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "x-rapidapi-host": "file-upload8.p.rapidapi.com",
          "x-rapidapi-key": "your-rapidapi-key-here",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const changeUserModerator = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/user/change-moderator`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const changeUserState = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/user/change-state`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const changeUserRole = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/user/change-role`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const addPrize = async (formData) => {
  try {
    const res = await axios.post(`${constants.ADMIN_API_URL}/prize`, formData, {
      headers: {
        Authorization: localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const editPrize = async (formData) => {
  try {
    const res = await axios.put(`${constants.ADMIN_API_URL}/prize`, formData, {
      headers: {
        Authorization: localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPrizeList = async (query) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/prizes`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: query,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPrizeInfoById = async (id) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/prize`, {
      params: { id },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePrizeApi = async (id, query) => {
  try {
    const res = await axios.delete(`${constants.ADMIN_API_URL}/prize`, {
      params: { id, query },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getChatbotSettingsGeneral = async () => {
  try {
    const res = await axios.get(
      `${constants.ADMIN_API_URL}/chatbot/settings/general`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const createChatbotSettingsGeneral = async (data) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/chatbot/settings/general`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateChatbotSettingsGeneral = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/chatbot/settings/general`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getChatbotSettingsCommand = async () => {
  try {
    const res = await axios.get(
      `${constants.ADMIN_API_URL}/chatbot/settings/command`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const createChatbotSettingsCommand = async (data) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/chatbot/settings/command`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateChatbotSettingsCommand = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/chatbot/settings/command`,
      data,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getChatbotMessages = async (count) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/chatbot/messages`, {
      params: { count },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getChatbotEvents = async (count) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/chatbot/events`, {
      params: { count },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getRaffleList = async (count) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/raffles`, {
      params: { count },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const addItem = async (formData) => {
  try {
    const res = await axios.post(`${constants.ADMIN_API_URL}/item`, formData, {
      headers: {
        Authorization: localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};
