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

export const getItemList = async (query) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/items`, {
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

export const deleteItem = async (id, query) => {
  try {
    const res = await axios.delete(`${constants.ADMIN_API_URL}/item`, {
      params: { id, query },
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

export const getItemInfoById = async (id) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/item`, {
      params: { id },
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

export const editItem = async (formData) => {
  try {
    const res = await axios.put(`${constants.ADMIN_API_URL}/item`, formData, {
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

export const getRedemptionPendingList = async (query) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/item/pending`, {
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

export const getRedemptionHistoryList = async (query) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/item/history`, {
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

export const processRedemption = async (id, state, query) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/item/process`,
      { id, state, query },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getItemRaffleByItem = async (itemId) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/item-raffle`, {
      params: { itemId },
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

export const createItemRaffle = async (id) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/item-raffle`,
      { id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const chooseWinners = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/item-raffle/winners`,
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
    return err.response.data;
  }
};

export const getChatbotSettingsAdditionalCommands = async (grade) => {
  try {
    const res = await axios.get(
      `${constants.ADMIN_API_URL}/chatbot/settings/additional-commands`,
      {
        params: { grade },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const createChatbotSettingsAdditionalCommand = async (data) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/chatbot/settings/additional-command`,
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
    return err.response.data;
  }
};

export const updateChatbotSettingsAdditionalCommand = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/chatbot/settings/additional-command`,
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
    return err.response.data;
  }
};
export const deleteChatbotSettingsAdditionalCommand = async (id) => {
  try {
    const res = await axios.delete(
      `${constants.ADMIN_API_URL}/chatbot/settings/additional-command`,
      {
        params: { id },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getChatbotSettingsTimers = async (grade) => {
  try {
    const res = await axios.get(
      `${constants.ADMIN_API_URL}/chatbot/settings/timers`,
      {
        params: { grade },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const createChatbotSettingsTimer = async (data) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/chatbot/settings/timer`,
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
    return err.response.data;
  }
};

export const updateChatbotSettingsTimer = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/chatbot/settings/timer`,
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
    return err.response.data;
  }
};
export const deleteChatbotSettingsTimer = async (id) => {
  try {
    const res = await axios.delete(
      `${constants.ADMIN_API_URL}/chatbot/settings/timer`,
      {
        params: { id },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getChatbotSettingsBet = async () => {
  try {
    const res = await axios.get(
      `${constants.ADMIN_API_URL}/chatbot/settings/bet`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const createChatbotSettingsBet = async (data) => {
  try {
    const res = await axios.post(
      `${constants.ADMIN_API_URL}/chatbot/settings/bet`,
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
    return err.response.data;
  }
};

export const updateChatbotSettingsBet = async (data) => {
  try {
    const res = await axios.put(
      `${constants.ADMIN_API_URL}/chatbot/settings/bet`,
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
    return err.response.data;
  }
};
export const getBettingList = async (count) => {
  try {
    const res = await axios.get(`${constants.ADMIN_API_URL}/bettings`, {
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
