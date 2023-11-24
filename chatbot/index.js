const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const dotnet = require("dotenv");
const randomstring = require("randomstring");

const browser = require("./browser");
const { printMessage, makeRegex } = require("./utils");
const {
  login,
  getCommandSettings,
  getGeneralSettings,
  addPointsToUser,
  addServerMessage,
  raffleDone,
  addPointsToWinners,
  addEvent,
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
} = require("./apis");

dotnet.config();
const port = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);

const init = async () => {
  try {
    const { token } = await login();
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
    } = await getCommandSettings(token);
    const {
      channel1,
      channel2,
      ws_end_point,
      time_duration,
      points_unit,
      subscriber_multiple,
      subscriber_points,
      autoRaffle,
      autoRaffleTime,
      autoRaffleBetween,
      autoRafflePoints,
      autoRaffleWinnerCount,
      email: botMail,
      password: botPwd,
    } = await getGeneralSettings(token);
    const additionalCommands = await getAdditionalCommandSettings(token);
    const timerSettings = await getTimerSettings(token);
    const {
      created: betCreated,
      joinSuccess: betJoinSuccess,
      alreadyJoined: betAlreadyJoined,
      notRegisteredUser: betNotRegisteredUser,
      doneInTime: betDoneInTime,
      doneOnTime: betDoneOnTime,
      resultNotice: betResultNotice,
      distributedPoints: betDistributedPoints,
      refundNotice: betRefundNotice,
    } = await getBetSettings(token);

    // Open web browser
    // TODO: recover
    // browser.initBrowser(botMail, botPwd);

    // If success in opening web browser
    // TODO: recover
    // browser.emitter.on("ready", () => {
    printMessage("Browser ready", "success");

    // Initialize
    const aWebSocket = new WebSocket(ws_end_point);
    const cServer = new WebSocket.Server({ server });
    let activeList = [];

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
      activeList.push(u);
    };

    // Check and add points to active users
    const intervalAddPoints = setInterval(async () => {
      for (var i = 0; i < activeList.length; i++) {
        const al = activeList[i];
        const p = al.isSubscriber
          ? points_unit * subscriber_multiple
          : points_unit;
        const resAddPointsToUser = await addPointsToUser(token, {
          name: al.name,
          points: p,
        });
        if (resAddPointsToUser.success) {
          const resAddEvent = await addEvent(token, {
            event: "AddPoint_Watcher",
            content: `Added ${p} points to watcher, ${al.name}`,
          });
          sendToAdmin({ type: "event", data: resAddEvent.event });
        }
      }
      activeList = [];
    }, time_duration * 1000);

    // Send message to channel server
    const sendToServer = async (msg) => {
      const resAddMessage = await addServerMessage(token, { message: msg });
      if (resAddMessage.success) {
        // TODO: recover
        // browser.sendMessage(msg);
        console.log(msg);
      }
    };

    const doneRaffle = async (raffle) => {
      const resRaffleDone = await raffleDone(token, { raffle });
      if (resRaffleDone.success) {
        const resAddPointsToWinners = await addPointsToWinners(token, {
          users: resRaffleDone.raffle.winners,
          points: raffle.points,
        });
        const resAddEventRaffle = await addEvent(token, {
          event: "DoneRaffle",
          content: `Ended ${raffle.name} raffle in ${raffle.time} seconds`,
        });
        sendToAdmin({ type: "event", data: resAddEventRaffle.event });
        const resAddEventUser = await addEvent(token, {
          event: "AddPoint_Winners",
          content: `Added ${raffle.points} points to ${resAddPointsToWinners.count} users`,
        });
        sendToAdmin({ type: "event", data: resAddEventUser.event });
        sendToAdmin({
          type: "raffle-done",
          data: resRaffleDone.raffle,
        });
        if (resAddPointsToWinners.usernames !== "") {
          const msgToServer = raffleEnd
            .replace("%USERS%", resAddPointsToWinners.usernames)
            .replace("%POINTS%", raffle.points)
            .replace("%NAME%", raffle.name);
          sendToServer(msgToServer);
        }
      }
    };

    const doneBet = async (betting, doneMode) => {
      console.log(betting);
      console.log(doneMode);
      // const resRaffleDone = await raffleDone(token, { raffle });
      // if (resRaffleDone.success) {
      //   const resAddPointsToWinners = await addPointsToWinners(token, {
      //     users: resRaffleDone.raffle.winners,
      //     points: raffle.points,
      //   });
      //   const resAddEventRaffle = await addEvent(token, {
      //     event: "DoneRaffle",
      //     content: `Ended ${raffle.name} raffle in ${raffle.time} seconds`,
      //   });
      //   sendToAdmin({ type: "event", data: resAddEventRaffle.event });
      //   const resAddEventUser = await addEvent(token, {
      //     event: "AddPoint_Winners",
      //     content: `Added ${raffle.points} points to ${resAddPointsToWinners.count} users`,
      //   });
      //   sendToAdmin({ type: "event", data: resAddEventUser.event });
      //   sendToAdmin({
      //     type: "raffle-done",
      //     data: resRaffleDone.raffle,
      //   });
      //   if (resAddPointsToWinners.usernames !== "") {
      //     const msgToServer = raffleEnd
      //       .replace("%USERS%", resAddPointsToWinners.usernames)
      //       .replace("%POINTS%", raffle.points)
      //       .replace("%NAME%", raffle.name);
      //     sendToServer(msgToServer);
      //   }
      // }
    };

    const makeRaffle = async (data) => {
      const resCreateRaffle = await createRaffle(token, data);
      if (resCreateRaffle.success) {
        sendToAdmin({
          type: "raffle-created",
          data: resCreateRaffle.raffle,
        });
        const resAddEvent = await addEvent(token, {
          event: "Raffle_Created",
          content: `Created ${resCreateRaffle.raffle.name} Raffle / ${resCreateRaffle.raffle.points} points`,
        });
        sendToAdmin({ type: "event", data: resAddEvent.event });
        const msgToServer = raffleStart
          .replace("%NAME%", data.name)
          .replace("%POINTS%", data.points)
          .replace("%TIME%", data.time)
          .replace("%COMMAND%", raffleJoin);
        sendToServer(msgToServer);
        setTimeout(() => {
          doneRaffle(resCreateRaffle.raffle);
        }, Number(data.time) * 1000);
      } else {
        printMessage(resCreateRaffle.message, "error");
      }
    };

    const makeBetting = async (data) => {
      const resCreateBetting = await createBetting(token, data);
      if (resCreateBetting.success) {
        sendToAdmin({
          type: "betting-created",
          data: resCreateBetting.data.betting,
        });
        const resAddEvent = await addEvent(token, {
          event: "Betting_Created",
          content: `Created ${resCreateBetting.data.betting.title} Betting for ${resCreateBetting.data.betting.duration} minutes`,
        });
        sendToAdmin({ type: "event", data: resAddEvent.event });
        const msgToServer = betCreated
          .replace("%TITLE%", data.title)
          .replace("%DURATION%", Number(data.duration) * 60)
          .replace("%MINAMOUNT%", data.minAmount)
          .replace("%MAXAMOUNT%", data.maxAmount)
          .replace("%COMMAND%", JSON.stringify(data.options));
        sendToServer(msgToServer);
        setTimeout(() => {
          doneBet(resCreateBetting.data.betting, "dateontime");
        }, Number(data.duration) * 1000 * 60);
      } else {
        printMessage(resCreateBetting.message, "error");
      }
    };

    sendToServer("Bot is ready");

    if (autoRaffle) {
      setInterval(() => {
        makeRaffle({
          name: randomstring.generate(),
          points: autoRafflePoints,
          time: autoRaffleTime,
          winnerCount: autoRaffleWinnerCount,
          mode: "auto",
        });
      }, (autoRaffleTime + autoRaffleBetween) * 1000);
    }

    timerSettings.map((t) => {
      setInterval(() => {
        sendToServer(t.message);
      }, t.duration * 1000);
    });

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
      printMessage("WebSocket connected to the channel of kick.com", "success");
    });
    aWebSocket.on("message", async (message) => {
      printMessage("Received message from kick.com:", "info");
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
        const resAddChannelMessage = await addChannelMessage(token, {
          event: "ChatMessage",
          name: username,
          content,
          created_at,
          badges,
        });
        sendToAdmin({ type: "message", data: resAddChannelMessage.msg });
        addUserToActiveList(resAddChannelMessage.msg);

        // If user wants to join to raffle
        if (content === raffleJoin) {
          const resAddUserToRaffle = await addUserToRaffle(token, {
            username,
          });
          if (
            resAddUserToRaffle.success === false &&
            resAddUserToRaffle.status === "not-ready"
          ) {
            const msgToServer = raffleNotReady.replace(
              "%USER%",
              `@${username}`
            );
            sendToServer(msgToServer);
          }
          if (
            resAddUserToRaffle.success === false &&
            resAddUserToRaffle.status === "no-register"
          ) {
            const msgToServer = raffleCant.replace("%USER%", `@${username}`);
            sendToServer(msgToServer);
          }
        }

        // If user wants to know remaining points
        if (content === pointsRemaining) {
          const resGetPoints = await getPoints(token, { username });
          if (!resGetPoints.success) {
            const msgToServer = pointsRemainingNotRegistered.replace(
              "%USER%",
              `@${username}`
            );
            sendToServer(msgToServer);
          } else {
            const msgToServer = pointsRemainingMsg
              .replace("%USER%", `@${username}`)
              .replace("%POINTS%", resGetPoints.points);
            sendToServer(msgToServer);
          }
        }

        // If user wants to add points
        if (content.match(regexAddPoint)) {
          const match = content.match(regexAddPoint);
          const users = match[1];
          const points = match[2];
          const resAddPointsByChatbot = await addPointsByChatbot(token, {
            username,
            users,
            points,
            badges,
            activeUsers: activeList.map((a) => a.name),
          });
          if (
            !resAddPointsByChatbot.success &&
            resAddPointsByChatbot.status === "not-allowed"
          ) {
            const msgToServer = addPointsMsgNotPermission.replace(
              "%USER%",
              `@${username}`
            );
            sendToServer(msgToServer);
          }
          if (resAddPointsByChatbot.success) {
            const resAddEvent = await addEvent(token, {
              event: "AddPoint_By_Moderator",
              content: `Added ${points} points to ${resAddPointsByChatbot.count} users`,
            });
            sendToAdmin({ type: "event", data: resAddEvent.event });
            const msgToServer = addPointsMsgSuccess
              .replace("%POINTS%", points)
              .replace("%NUMBER%", resAddPointsByChatbot.count)
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
          const resDelPointsByChatbot = await delPointsByChatbot(token, {
            username,
            users,
            points,
            badges,
          });
          if (
            !resDelPointsByChatbot.success &&
            resDelPointsByChatbot.status === "not-allowed"
          ) {
            const msgToServer = delPointsMsgNotPermission.replace(
              "%USER%",
              `@${username}`
            );
            sendToServer(msgToServer);
          }
          if (resDelPointsByChatbot.success) {
            const resAddEvent = await addEvent(token, {
              event: "DelPoint_By_Moderator",
              content: `Removed ${points} points from ${resDelPointsByChatbot.count} users`,
            });
            sendToAdmin({ type: "event", data: resAddEvent.event });
            const msgToServer = delPointsMsgSuccess
              .replace("%POINTS%", points)
              .replace("%NUMBER%", resDelPointsByChatbot.count)
              .replace("%COMMAND%", delPointsMsg)
              .replace("%POINTS%", "")
              .replace("%USERS%", "");
            sendToServer(msgToServer);
          }
        }

        additionalCommands.map((c) => {
          if (c.command === content) {
            sendToServer(c.reply);
          }
        });
      }

      // If user subscribes
      if (event === "App\\Events\\SubscriptionEvent") {
        const { username, months } = JSON.parse(data);
        const resAddChannelMessage = await addChannelMessage(token, {
          event: "Subscription",
          name: username,
          content: `Subscribe the channel for ${months} months`,
          badges: [],
        });
        sendToAdmin({ type: "message", data: resAddChannelMessage.msg });
        const resAddPointsToUser = await addPointsToUser(token, {
          name: username,
          points: subscriber_points,
        });
        if (resAddPointsToUser.success) {
          const resAddEvent = await addEvent(token, {
            event: "AddPoint_New_Subscriber",
            content: `Added ${subscriber_points} points to new subscriber, ${username}`,
          });
          sendToAdmin({ type: "event", data: resAddEvent.event });
        }
      }
    });
    aWebSocket.on("close", () => {
      printMessage(
        "WebSocket disconnected from the channel of kick.com",
        "error"
      );
    });
    aWebSocket.on("error", () => {
      printMessage(
        "There occurs error in connection with the channel of kick.com",
        "error"
      );
    });
    cServer.on("connection", (cSocket) => {
      printMessage("Admin connected to the chatbot", "success");
      cSocket.on("message", async (message) => {
        printMessage("Received message from an admin:", "info");
        console.log(JSON.parse(message));
        const { type, data } = JSON.parse(message);

        // If created new raffle
        if (type === "raffle-create") {
          await makeRaffle({ ...data, mode: "manual" });
        }

        // If created new betting
        if (type === "betting-create") {
          await makeBetting(data);
        }
      });
      cSocket.on("close", () => {
        printMessage("Admin disconnected from the chatbot", "error");
      });
      cSocket.on("error", () => {
        printMessage("Admin disconnected from the chatbot", "error");
      });
    });
    cServer.on("close", () => {
      printMessage("Closed the connection with the admins", "error");
    });
    cServer.on("error", () => {
      printMessage("There is bug in connection with admin site", "error");
    });
    // TODO: recover
    // });
  } catch (err) {
    printMessage(err, "error");
  }
};

server.listen(port, () => {
  printMessage(`Chatbot is running on port ${port}`, "info");
  init();
});
