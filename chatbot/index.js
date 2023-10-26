const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const axios = require("axios");
const dotnet = require("dotenv");
const colors = require("colors");
const browser = require("./browser");

const constants = require("./constants");

dotnet.config();
const port = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);

const init = async () => {
  try {
    // Login to backend as admin
    const loginRes = await axios.post(
      `${constants.BACKEND_API_URL}/auth/login`,
      {
        email: constants.ADMIN_EMAIL,
        password: constants.ADMIN_PASSWORD,
        rememberMe: true,
      }
    );
    const { token } = loginRes.data;

    // Get settings for a chatbot
    const settingsCommandRes = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/command`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const settingsGeneralRes = await axios.get(
      `${constants.BACKEND_API_URL}/chatbot/settings/general`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const {
      raffleStart,
      raffleJoin,
      raffleEnd,
      raffleNotReady,
      raffleCant,
      pointsRemaining,
      pointsRemainingMsg,
      pointsRemainingNotRegistered,
      addPointsMsg,
      addPointsMsgSuccess,
      addPointsMsgNotPermission,
      delPointsMsg,
      delPointsMsgSuccess,
      delPointsMsgNotPermission,
    } = settingsCommandRes.data.settings;
    const {
      channel1,
      channel2,
      ws_end_point,
      time_duration,
      points_unit,
      subscriber_multiple,
      subscriber_points,
      email: botMail,
      password: botPwd,
    } = settingsGeneralRes.data.settings;

    // Open web browser
    browser.initBrowser(botMail, botPwd);

    // If success in opening web browser
    browser.emitter.on("ready", () => {
      console.log("Browser ready...".bgWhite.green);

      // Initialize
      const aWebSocket = new WebSocket(ws_end_point);
      const cServer = new WebSocket.Server({ server });
      let activeList = [];
      let lastActiveList = [];

      // Send messages to admin site
      const sendToAdmin = (d) => {
        cServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(d));
          }
        });
      };

      // Add active user to list
      const addUserToActiveList = (u) => {
        if (activeList.some((el) => el.name === u.name)) return;
        const lsU = lastActiveList.find((el) => el.name === u.name);
        if (lsU) {
          activeList.push({ ...u, lastAddedPoints: lsU.addedPoints });
        } else activeList.push({ ...u, lastAddedPoints: 0 });
      };

      // Check and add points to active users
      const intervalAddPoints = setInterval(async () => {
        let tempActiveList = [];
        for (var i = 0; i < activeList.length; i++) {
          const al = activeList[i];
          const p = al.isSubscriber
            ? al.lastAddedPoints === 0
              ? points_unit
              : al.lastAddedPoints * subscriber_multiple
            : points_unit;
          const resBackend = await axios.put(
            `${constants.BACKEND_API_URL}/user/add-points`,
            {
              name: al.name,
              points: p,
            },
            { headers: { Authorization: token } }
          );
          if (resBackend.data.success) {
            const resEvent = await axios.post(
              `${constants.BACKEND_API_URL}/chatbot/event`,
              {
                event: "AddPoint_Watcher",
                content: `Added ${p} points to watcher, ${al.name}`,
                created_at: Date.now(),
              },
              { headers: { Authorization: token } }
            );
            sendToAdmin({ type: "event", data: resEvent.data.event });
          }
          tempActiveList.push({ ...al, addedPoints: p });
        }
        lastActiveList = [...tempActiveList];
        activeList = [];
      }, time_duration * 1000);

      // Send message to channel server
      const sendToServer = async (msg) => {
        const resBackend = await axios.post(
          `${constants.BACKEND_API_URL}/server/message`,
          {
            message: msg,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (resBackend.data.success) {
          browser.sendMessage(msg);
        }
      };

      const doneRaffle = async (raffle) => {
        const resBackendRaffle = await axios.put(
          `${constants.BACKEND_API_URL}/raffle/done`,
          {
            raffle,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (resBackendRaffle.data.success) {
          const resBackendUser = await axios.put(
            `${constants.BACKEND_API_URL}/user/add-points-raffle`,
            {
              users: resBackendRaffle.data.raffle.winners,
              points: raffle.points,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const resEventRaffle = await axios.post(
            `${constants.BACKEND_API_URL}/chatbot/event`,
            {
              event: "DoneRaffle",
              content: `Ended ${raffle.name} raffle in ${raffle.time} seconds`,
              created_at: Date.now(),
            },
            { headers: { Authorization: token } }
          );
          sendToAdmin({ type: "event", data: resEventRaffle.data.event });
          const resEventUser = await axios.post(
            `${constants.BACKEND_API_URL}/chatbot/event`,
            {
              event: "AddPoint_Winners",
              content: `Added ${raffle.points} points to ${resBackendUser.data.count} users`,
              created_at: Date.now(),
            },
            { headers: { Authorization: token } }
          );
          sendToAdmin({ type: "event", data: resEventUser.data.event });
          sendToAdmin({
            type: "raffle-done",
            data: resBackendRaffle.data.raffle,
          });
          if (resBackendUser.data.usernames !== "") {
            const msgToServer = raffleEnd
              .replace("%USERS%", resBackendUser.data.usernames)
              .replace("%POINTS%", raffle.points)
              .replace("%NAME%", raffle.name);
            sendToServer(msgToServer);
          }
        }
      };

      // Make regex for addPoint and delPoint
      const makeRegex = (str) => {
        const regexStr = str
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/%\w+%/g, (match) => {
            if (match === "%USERS%") {
              return "([\\w,\\s]+)";
            } else if (match === "%POINTS%") {
              return "(\\d+)";
            } else {
              return match;
            }
          })
          .replace(/\s+/g, "\\s+");
        return new RegExp(`^${regexStr}$`);
      };

      // Data for getting websocket
      const data1 = {
        event: "pusher:subscribe",
        data: {
          auth: "",
          channel: channel1,
        },
      };
      const data2 = {
        event: "pusher:subscribe",
        data: {
          auth: "",
          channel: channel2,
        },
      };
      const data3 = {
        event: "pusher:ping",
        data: {},
      };

      // Regex for addPoint and delPoint
      const regexAddPoint = makeRegex(addPointsMsg);
      const regexDelPoint = makeRegex(delPointsMsg);

      const rePing = setInterval(() => {
        aWebSocket.send(JSON.stringify(data3));
      }, 5 * 1000);

      aWebSocket.on("open", () => {
        aWebSocket.send(JSON.stringify(data1));
        aWebSocket.send(JSON.stringify(data2));
        console.log(
          "WebSocket connected to the channel of kick.com".bgWhite.green
        );
      });
      aWebSocket.on("message", async (message) => {
        console.log("Received message from kick.com:".bgMagenta.white.bold);
        console.log(JSON.parse(message));
        const { event, data } = JSON.parse(message);

        // If general message
        if (event === "App\\Events\\ChatMessageEvent") {
          const {
            content,
            created_at,
            sender: {
              username,
              identity: { badges },
            },
          } = JSON.parse(data);
          const resMsg = await axios.post(
            `${constants.BACKEND_API_URL}/chatbot/message`,
            {
              event: "ChatMessage",
              name: username,
              content,
              created_at,
              badges,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          sendToAdmin({ type: "message", data: resMsg.data.msg });
          addUserToActiveList(resMsg.data.msg);

          // If user wants to join to raffle
          if (content === raffleJoin) {
            const resBackend = await axios.put(
              `${constants.BACKEND_API_URL}/raffle/add-user`,
              {
                username,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            if (
              resBackend.data.success === false &&
              resBackend.data.status === "not-ready"
            ) {
              const msgToServer = raffleNotReady.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            }
            if (
              resBackend.data.success === false &&
              resBackend.data.status === "no-register"
            ) {
              const msgToServer = raffleCant.replace("%USER%", `@${username}`);
              sendToServer(msgToServer);
            }
          }

          // If user wants to know remaining points
          if (content === pointsRemaining) {
            const resBackend = await axios.get(
              `${constants.BACKEND_API_URL}/user/points`,
              {
                params: {
                  username,
                },
                headers: {
                  Authorization: token,
                },
              }
            );
            if (!resBackend.data.success) {
              const msgToServer = pointsRemainingNotRegistered.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            } else {
              const msgToServer = pointsRemainingMsg
                .replace("%USER%", `@${username}`)
                .replace("%POINTS%", resBackend.data.points);
              sendToServer(msgToServer);
            }
          }

          // If user wants to add points
          if (content.match(regexAddPoint)) {
            const match = content.match(regexAddPoint);
            const users = match[1];
            const points = match[2];
            const resBackend = await axios.put(
              `${constants.BACKEND_API_URL}/user/add-points-chatbot`,
              {
                username,
                users,
                points,
                badges,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            if (
              !resBackend.data.success &&
              resBackend.data.status === "not-allowed"
            ) {
              const msgToServer = addPointsMsgNotPermission.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            }
            if (resBackend.data.success) {
              const resEvent = await axios.post(
                `${constants.BACKEND_API_URL}/chatbot/event`,
                {
                  event: "AddPoint_By_Moderator",
                  content: `Added ${points} points to ${resBackend.data.count} users`,
                  created_at: Date.now(),
                },
                { headers: { Authorization: token } }
              );
              sendToAdmin({ type: "event", data: resEvent.data.event });
              console.log(addPointsMsg);
              const msgToServer = addPointsMsgSuccess
                .replace("%POINTS%", points)
                .replace("%NUMBER%", resBackend.data.count)
                .replace("%COMMAND%", addPointsMsg)
                .replace("%USERS%", "")
                .replace("%POINTS%", "");
              sendToServer(msgToServer);
            }
          }

          // If user wants to del points
          if (content.match(regexDelPoint)) {
            const match = content.match(regexDelPoint);
            const users = match[1];
            const points = match[2];
            const resBackend = await axios.put(
              `${constants.BACKEND_API_URL}/user/del-points-chatbot`,
              {
                username,
                users,
                points,
                badges,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            if (
              !resBackend.data.success &&
              resBackend.data.status === "not-allowed"
            ) {
              const msgToServer = delPointsMsgNotPermission.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            }
            if (resBackend.data.success) {
              const resEvent = await axios.post(
                `${constants.BACKEND_API_URL}/chatbot/event`,
                {
                  event: "DelPoint_By_Moderator",
                  content: `Removed ${points} points from ${resBackend.data.count} users`,
                  created_at: Date.now(),
                },
                { headers: { Authorization: token } }
              );
              sendToAdmin({ type: "event", data: resEvent.data.event });
              const msgToServer = delPointsMsgSuccess
                .replace("%POINTS%", points)
                .replace("%NUMBER%", resBackend.data.count)
                .replace("%COMMAND%", delPointsMsg)
                .replace("%POINTS%", "")
                .replace("%USERS%", "");
              sendToServer(msgToServer);
            }
          }
        }

        // If user subscribes
        if (event === "App\\Events\\SubscriptionEvent") {
          const { username, months } = JSON.parse(data);
          const resMsg = await axios.post(
            `${constants.BACKEND_API_URL}/chatbot/message`,
            {
              event: "Subscription",
              name: username,
              content: `Subscribe the channel for ${months} months`,
              created_at: Date.now(),
              badges: [],
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          sendToAdmin({ type: "message", data: resMsg.data.msg });
          const resBackend = await axios.put(
            `${constants.BACKEND_API_URL}/user/add-points`,
            {
              name: username,
              points: subscriber_points,
            },
            { headers: { Authorization: token } }
          );
          if (resBackend.data.success) {
            const resEvent = await axios.post(
              `${constants.BACKEND_API_URL}/chatbot/event`,
              {
                event: "AddPoint_New_Subscriber",
                content: `Added ${subscriber_points} points to new subscriber, ${username}`,
                created_at: Date.now(),
              },
              { headers: { Authorization: token } }
            );
            sendToAdmin({ type: "event", data: resEvent.data.event });
          }
        }
      });
      aWebSocket.on("close", () => {
        console.log(
          "WebSocket disconnected from the channel of kick.com".bgCyan.blue
        );
      });
      aWebSocket.on("error", () => {
        console.log(
          "There occurs error in connection with the channel of kick.com"
            .bgYellow.red
        );
      });
      cServer.on("connection", (cSocket) => {
        console.log("Admin connected to the chatbot".bgWhite.green);
        cSocket.on("message", async (message) => {
          console.log("Received message from an admin:".bgMagenta.white.bold);
          console.log(JSON.parse(message));
          const { type, data } = JSON.parse(message);

          // If created new raffle
          if (type === "raffle-create") {
            const resBackend = await axios.post(
              `${constants.BACKEND_API_URL}/raffle`,
              data,
              { headers: { Authorization: token } }
            );
            if (resBackend.data.success) {
              sendToAdmin({
                type: "raffle-created",
                data: resBackend.data.raffle,
              });
              const resEvent = await axios.post(
                `${constants.BACKEND_API_URL}/chatbot/event`,
                {
                  event: "Raffle_Created",
                  content: `Created ${resBackend.data.raffle.name} Raffle / ${resBackend.data.raffle.points} points`,
                  created_at: Date.now(),
                },
                { headers: { Authorization: token } }
              );
              sendToAdmin({ type: "event", data: resEvent.data.event });
              const msgToServer = raffleStart
                .replace("%NAME%", data.name)
                .replace("%POINTS%", data.points)
                .replace("%TIME%", data.time)
                .replace("%COMMAND%", raffleJoin);
              sendToServer(msgToServer);
              setTimeout(() => {
                doneRaffle(resBackend.data.raffle);
              }, Number(data.time) * 1000);
            }
          }
        });
        cSocket.on("close", () => {
          console.log("Admin disconnected from the chatbot".bgCyan.blue);
        });
        cSocket.on("error", () => {
          console.log("Admin disconnected from the chatbot".bgYellow.red);
        });
      });
      cServer.on("close", () => {
        console.log("Closed the connection with the admins".bgCyan.blue);
      });
      cServer.on("error", () => {
        console.log("There is bug in connection with admin site".bgYellow.red);
      });
    });
  } catch (err) {
    console.log("Error occurs".bgYellow.red);
  }
};

server.listen(port, () => {
  console.log(`Chatbot is running on port ${port}`.bgWhite.green);
  init();
});
