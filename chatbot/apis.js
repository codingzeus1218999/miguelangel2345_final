const axios = require("axios");
const { ZenRows } = require("zenrows");

const constants = require("./constants");
const { printMessage } = require("./utils");

const login = async () => {
  try {
    const res = await axios.post(`${constants.BACKEND_API_URL}/auth/login`, {
      email: constants.ADMIN_EMAIL,
      password: constants.ADMIN_PASSWORD,
      rememberMe: true,
    });
    return res.data;
  } catch (err) {
    printMessage(
      `login to backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getCommandSettings = async (token) => {
  try {
    const res = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/command`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data.settings;
  } catch (err) {
    printMessage(
      `getting command settings from backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getGeneralSettings = async (token) => {
  try {
    const res = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/general`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data.settings;
  } catch (err) {
    printMessage(
      `getting general settings from backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addPointsToUser = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/user/add-points`,
      data,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding points to user failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addEvent = async (token, data) => {
  try {
    const res = await axios.post(
      `${constants.BACKEND_API_URL}/chatbot/event`,
      data,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding event to backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addServerMessage = async (token, data) => {
  try {
    const res = await axios.post(
      `${constants.BACKEND_API_URL}/server/message`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding server message to backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const raffleDone = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/raffle/done`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `finishing raffle failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addPointsToWinners = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/user/add-points-raffle`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding points to winners failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addChannelMessage = async (token, data) => {
  try {
    const res = await axios.post(
      `${constants.BACKEND_API_URL}/chatbot/message`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding channel message to backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addUserToRaffle = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/raffle/add-user`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding user to raffle failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getPoints = async (token, params) => {
  try {
    const res = await axios.get(`${constants.BACKEND_API_URL}/user/points`, {
      params,
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (err) {
    printMessage(
      `getting points failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const addPointsByChatbot = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/user/add-points-chatbot`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `adding points by chatbot failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const delPointsByChatbot = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/user/del-points-chatbot`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `deleting by chatbot failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const createRaffle = async (token, data) => {
  try {
    const res = await axios.post(`${constants.BACKEND_API_URL}/raffle`, data, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    printMessage(
      `creating raffle failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getAdditionalCommandSettings = async (token) => {
  try {
    const res = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/additional-commands`,
      {
        params: { grade: "allowed" },
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data.data.settings;
  } catch (err) {
    printMessage(
      `getting additional command settings from backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getTimerSettings = async (token) => {
  try {
    const res = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/timers`,
      {
        params: { grade: "allowed" },
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data.data.timers;
  } catch (err) {
    printMessage(
      `getting timer settings from backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const createBetting = async (token, data) => {
  try {
    const res = await axios.post(`${constants.BACKEND_API_URL}/betting`, data, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    printMessage(
      `creating betting failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getBetSettings = async (token) => {
  try {
    const res = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/bet`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data.data.setting;
  } catch (err) {
    printMessage(
      `getting bet settings from backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const joinToBetting = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/betting/join`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `joining to the betting failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const finishBetting = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/betting/finish`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `finishing raffle failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};
const EndBettingRefund = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/betting/refund`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `refunding raffle failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};
const EndBettingCalculate = async (token, data) => {
  try {
    const res = await axios.put(
      `${constants.BACKEND_API_URL}/betting/calculate`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    printMessage(
      `refunding raffle failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};
const getBetting = async (token, params) => {
  try {
    const res = await axios.get(`${constants.BACKEND_API_URL}/betting`, {
      params,
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (err) {
    printMessage(
      `getting betting failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getLatestBetting = async (token) => {
  try {
    const res = await axios.get(`${constants.BACKEND_API_URL}/betting/latest`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (err) {
    printMessage(
      `getting latest betting from backend failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

const getChannelInfo = async () => {
  const client = new ZenRows(constants.ZEN_ROWS_API_KEY);
  const url = `${constants.KICK_URL}/api/v2/channels/${constants.CHANNEL}`;
  try {
    const { data } = await client.get(url, []);
    return data;
  } catch (err) {
    printMessage(
      `getting channel info failed: ${err.response?.data?.message}`,
      "error"
    );
  }
};

module.exports = {
  login,
  getCommandSettings,
  getGeneralSettings,
  addPointsToUser,
  addEvent,
  addServerMessage,
  raffleDone,
  addPointsToWinners,
  addChannelMessage,
  addUserToRaffle,
  getPoints,
  addPointsByChatbot,
  delPointsByChatbot,
  createRaffle,
  getAdditionalCommandSettings,
  getTimerSettings,
  createBetting,
  getBetSettings,
  joinToBetting,
  finishBetting,
  EndBettingRefund,
  EndBettingCalculate,
  getBetting,
  getLatestBetting,
  getChannelInfo,
};
