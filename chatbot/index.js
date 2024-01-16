const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const dotnet = require("dotenv");
const randomstring = require("randomstring");

const browser = require("./browser");
const {
  printMessage,
  makeRegex,
  makeRegexBettingOptions,
  validJsonString,
} = require("./utils");
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
  joinToBetting,
  finishBetting,
  EndBettingRefund,
  EndBettingCalculate,
  getBetting,
  getLatestBetting,
  getChannelInfo,
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
      useRaffleCommand,
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
      activeDuration,
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
      pointsAmount: betPointsAmount,
      notEnough: betNotEnough,
      doneOnTime: betDoneOnTime,
      resultNotice: betResultNotice,
      distributedPoints: betDistributedPoints,
      refundNotice: betRefundNotice,
    } = await getBetSettings(token);

    // Open web browser
    // TODO: for dev
    browser.initBrowser(botMail, botPwd);

    // If success in opening web browser
    // TODO: for dev
    browser.emitter.on("ready", () => {
      printMessage("Browser ready", "success");

      // Initialize
      const aWebSocket = new WebSocket(ws_end_point);
      const cServer = new WebSocket.Server({ server });
      let activeList = [];
      let ongoingBetting = null;

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
        if (activeList.some((el) => el.name === u?.name)) return;
        activeList.push(u);
      };

      // Check and add points to active users
      const intervalAddPoints = setInterval(async () => {
        const channelInfo = await getChannelInfo();
        if (channelInfo?.livestream?.is_live) {
          for (var i = 0; i < activeList.length; i++) {
            const al = activeList[i];
            const p = al.isSubscriber
              ? parseInt(Number(points_unit) * Number(subscriber_multiple))
              : points_unit;
            const resAddPointsToUser = await addPointsToUser(token, {
              name: al.name,
              points: p,
            });
            if (resAddPointsToUser?.success) {
              const resAddEvent = await addEvent(token, {
                event: "AddPoint_Watcher",
                content: `Added ${p} points to watcher, ${al.name}`,
              });
              sendToAdmin({ type: "event", data: resAddEvent?.event });
            }
          }
        }
      }, time_duration * 1000);

      // Clear the active list every activeDuration
      const intervalClearActiveList = setInterval(() => {
        activeList = [];
      }, activeDuration * 1000);

      // Send message to channel server
      const sendToServer = async (msg) => {
        const resAddMessage = await addServerMessage(token, { message: msg });
        if (resAddMessage?.success) {
          // TODO: for dev
          // console.log(msg);
          browser.sendMessage(msg);
        }
      };
      const doneRaffle = async (raffle) => {
        const resRaffleDone = await raffleDone(token, { raffle });
        if (resRaffleDone?.success) {
          const resAddPointsToWinners = await addPointsToWinners(token, {
            users: resRaffleDone?.raffle?.winners,
            points: raffle.points,
          });
          const resAddEventRaffle = await addEvent(token, {
            event: "DoneRaffle",
            content: `Ended ${raffle.name} raffle in ${raffle.time} seconds`,
          });
          sendToAdmin({ type: "event", data: resAddEventRaffle?.event });
          const resAddEventUser = await addEvent(token, {
            event: "AddPoint_Winners",
            content: `Added ${raffle.points} points to ${resAddPointsToWinners?.count} users`,
          });
          sendToAdmin({ type: "event", data: resAddEventUser?.event });
          sendToAdmin({
            type: "raffle-done",
            data: resRaffleDone?.raffle,
          });
          if (resAddPointsToWinners?.usernames !== "") {
            const msgToServer = raffleEnd
              .replace("%USERS%", resAddPointsToWinners?.usernames)
              .replace("%POINTS%", raffle.points)
              .replace("%NAME%", raffle.name);
            sendToServer(msgToServer);
          }
        }
      };

      const doneBetting = async (betting, doneMode) => {
        const resFinishBetting = await finishBetting(token, {
          bettingId: betting._id,
          doneMode,
        });
        if (resFinishBetting?.success) {
          ongoingBetting = null;
          const resAddEventBetting = await addEvent(token, {
            event: "FinishBetting",
            content: `Finished ${betting.title} betting ${doneMode}`,
          });
          sendToAdmin({ type: "event", data: resAddEventBetting?.event });
          sendToAdmin({
            type: "betting-finished",
            data: resFinishBetting?.data?.betting,
          });
          let msgToServer = "";
          if (doneMode === "doneontime") {
            msgToServer = betDoneOnTime.replace("%TITLE%", betting.title);
            sendToServer(msgToServer);
          } else if (doneMode === "doneintime") {
            msgToServer = betDoneInTime.replace("%TITLE%", betting.title);
            sendToServer(msgToServer);
          }
        }
      };

      const refundBetting = async (betting) => {
        const resEndBetting = await EndBettingRefund(token, { betting });
        if (resEndBetting?.success) {
          const resAddEventBetting = await addEvent(token, {
            event: "RefundBetting",
            content: `Refunded ${betting.title} betting`,
          });
          sendToAdmin({ type: "event", data: resAddEventBetting?.event });
          sendToAdmin({
            type: "betting-refunded",
            data: resEndBetting?.data?.betting,
          });
          const msgToServer = betRefundNotice.replace("%TITLE%", betting.title);
          sendToServer(msgToServer);
        }
      };

      const calculateBetting = async ({ betting, winOptionId }) => {
        const resEndBetting = await EndBettingCalculate(token, {
          betting,
          winOptionId,
        });
        if (resEndBetting?.success) {
          let resAddEventBetting = await addEvent(token, {
            event: "Betting_winner_selected",
            content: `${resEndBetting?.data?.winOption} options selected in ${betting.title} betting`,
          });
          sendToAdmin({ type: "event", data: resAddEventBetting?.event });
          resAddEventBetting = await addEvent(token, {
            event: "AddPoint_winners_betting",
            content: `${resEndBetting?.data?.allPoints} points has been distributed to ${resEndBetting?.data?.winnerCount} users in ${betting.title} betting`,
          });
          sendToAdmin({ type: "event", data: resAddEventBetting?.event });
          sendToAdmin({
            type: "betting-calculated",
            data: resEndBetting?.data?.betting,
          });
          let msgToServer = betResultNotice
            .replace("%TITLE%", betting.title)
            .replace("%OPTION%", resEndBetting?.data?.winOption);
          sendToServer(msgToServer);
          msgToServer = betDistributedPoints
            .replace("%POINTS%", resEndBetting?.data?.allPoints)
            .replace("%COUNT%", resEndBetting?.data?.winnerCount);
          sendToServer(msgToServer);
        }
      };

      const sendLatestBetting = async () => {
        const resGettingLastestBetting = await getLatestBetting(token);
        if (resGettingLastestBetting?.success) {
          sendToAdmin({
            type: "betting-latest",
            data: {
              ...resGettingLastestBetting?.data?.betting,
              remainingSeconds:
                resGettingLastestBetting?.data?.betting?.duration * 60 -
                parseInt(
                  (Date.now() -
                    new Date(
                      resGettingLastestBetting?.data?.betting?.createdAt
                    ).getTime()) /
                    1000
                ),
              isOngoing: ongoingBetting ? true : false,
            },
          });
        } else {
          sendToAdmin({ type: "betting-latest", data: {} });
        }
      };

      const intervalSendLatestBetting = setInterval(() => {
        sendLatestBetting();
      }, 1000);

      const makeRaffle = async (data) => {
        const resCreateRaffle = await createRaffle(token, data);
        if (resCreateRaffle?.success) {
          sendToAdmin({
            type: "raffle-created",
            data: resCreateRaffle?.raffle,
          });
          const resAddEvent = await addEvent(token, {
            event: "Raffle_Created",
            content: `Created ${resCreateRaffle?.raffle?.name} Raffle / ${resCreateRaffle?.raffle?.points} points`,
          });
          sendToAdmin({ type: "event", data: resAddEvent?.event });
          const msgToServer = raffleStart
            .replace("%NAME%", data.name)
            .replace("%POINTS%", data.points)
            .replace("%TIME%", data.time)
            .replace("%COMMAND%", raffleJoin);
          sendToServer(msgToServer);
          setTimeout(() => {
            doneRaffle(resCreateRaffle?.raffle);
          }, Number(data.time) * 1000);
        } else {
          printMessage(resCreateRaffle?.message, "error");
        }
      };

      const makeBetting = async (data) => {
        const resCreateBetting = await createBetting(token, data);
        if (resCreateBetting?.success) {
          sendToAdmin({
            type: "betting-created",
            data: resCreateBetting?.data?.betting,
          });
          const resAddEvent = await addEvent(token, {
            event: "Betting_Created",
            content: `Created ${resCreateBetting?.data?.betting.title} Betting for ${resCreateBetting?.data?.betting?.duration} minutes`,
          });
          sendToAdmin({ type: "event", data: resAddEvent?.event });
          const msgToServer = betCreated
            .replace("%TITLE%", data.title)
            .replace("%DURATION%", Number(data.duration) * 60)
            .replace("%MINAMOUNT%", data.minAmount)
            .replace("%MAXAMOUNT%", data.maxAmount)
            .replace("%COMMANDS%", JSON.stringify(data.options));
          sendToServer(msgToServer);
          ongoingBetting = { ...resCreateBetting?.data?.betting };
          setTimeout(() => {
            doneBetting(resCreateBetting?.data?.betting, "doneontime");
          }, Number(data.duration) * 1000 * 60);
        } else {
          printMessage(resCreateBetting?.message, "error");
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
        printMessage(
          "WebSocket connected to the channel of kick.com",
          "success"
        );
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
          sendToAdmin({ type: "message", data: resAddChannelMessage?.msg });
          addUserToActiveList(resAddChannelMessage?.msg);

          // auto join to raffle
          if (!useRaffleCommand) await addUserToRaffle(token, { username });

          // If user wants to join to raffle
          if (content === raffleJoin && useRaffleCommand) {
            const resAddUserToRaffle = await addUserToRaffle(token, {
              username,
            });
            if (
              resAddUserToRaffle?.success === false &&
              resAddUserToRaffle?.status === "not-ready"
            ) {
              const msgToServer = raffleNotReady.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            }
            if (
              resAddUserToRaffle?.success === false &&
              resAddUserToRaffle?.status === "no-register"
            ) {
              const msgToServer = raffleCant.replace("%USER%", `@${username}`);
              sendToServer(msgToServer);
            }
          }

          // If user wants to know remaining points
          if (content === pointsRemaining) {
            const resGetPoints = await getPoints(token, { username });
            if (!resGetPoints?.success) {
              const msgToServer = pointsRemainingNotRegistered.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            } else {
              const msgToServer = pointsRemainingMsg
                .replace("%USER%", `@${username}`)
                .replace("%POINTS%", resGetPoints?.points);
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
              !resAddPointsByChatbot?.success &&
              resAddPointsByChatbot?.status === "not-allowed"
            ) {
              const msgToServer = addPointsMsgNotPermission.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            }
            if (resAddPointsByChatbot?.success) {
              const resAddEvent = await addEvent(token, {
                event: "AddPoint_By_Moderator",
                content: `Added ${points} points to ${resAddPointsByChatbot?.count} users`,
              });
              sendToAdmin({ type: "event", data: resAddEvent?.event });
              const msgToServer = addPointsMsgSuccess
                .replace("%POINTS%", points)
                .replace("%NUMBER%", resAddPointsByChatbot?.count)
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
              !resDelPointsByChatbot?.success &&
              resDelPointsByChatbot?.status === "not-allowed"
            ) {
              const msgToServer = delPointsMsgNotPermission.replace(
                "%USER%",
                `@${username}`
              );
              sendToServer(msgToServer);
            }
            if (resDelPointsByChatbot?.success) {
              const resAddEvent = await addEvent(token, {
                event: "DelPoint_By_Moderator",
                content: `Removed ${points} points from ${resDelPointsByChatbot?.count} users`,
              });
              sendToAdmin({ type: "event", data: resAddEvent?.event });
              const msgToServer = delPointsMsgSuccess
                .replace("%POINTS%", points)
                .replace("%NUMBER%", resDelPointsByChatbot?.count)
                .replace("%COMMAND%", delPointsMsg)
                .replace("%POINTS%", "")
                .replace("%USERS%", "");
              sendToServer(msgToServer);
            }
          }

          // If user wants to join to the betting
          if (ongoingBetting) {
            ongoingBetting.options.map(async (option) => {
              if (content.match(makeRegexBettingOptions(option.command))) {
                const match = content.match(
                  makeRegexBettingOptions(option.command)
                );
                const points = match[1];
                const caseBetting = option.case;
                const resJoinBetting = await joinToBetting(token, {
                  id: ongoingBetting._id,
                  username,
                  caseBetting,
                  points,
                });
                let msgToServer = "";
                if (resJoinBetting?.success) {
                  msgToServer = betJoinSuccess.replace("%USER%", username);
                  sendToServer(msgToServer);
                } else {
                  switch (resJoinBetting?.data?.status) {
                    case "not-registered":
                      msgToServer = betNotRegisteredUser.replace(
                        "%USER%",
                        username
                      );
                      sendToServer(msgToServer);
                      break;
                    case "already-joined":
                      msgToServer = betAlreadyJoined.replace(
                        "%USER%",
                        username
                      );
                      sendToServer(msgToServer);
                      break;
                    case "invalid-points":
                      msgToServer = betPointsAmount
                        .replace("%USER%", username)
                        .replace("%MINAMOUNT%", ongoingBetting.minAmount)
                        .replace("%MAXAMOUNT%", ongoingBetting.maxAmount);
                      sendToServer(msgToServer);
                      break;
                    case "not-enough-points":
                      msgToServer = betNotEnough.replace("%USER%", username);
                      sendToServer(msgToServer);
                      break;
                    default:
                      break;
                  }
                }
              }
            });
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
          sendToAdmin({ type: "message", data: resAddChannelMessage?.msg });
          const resAddPointsToUser = await addPointsToUser(token, {
            name: username,
            points: subscriber_points,
          });
          if (resAddPointsToUser?.success) {
            const resAddEvent = await addEvent(token, {
              event: "AddPoint_New_Subscriber",
              content: `Added ${subscriber_points} points to new subscriber, ${username}`,
            });
            sendToAdmin({ type: "event", data: resAddEvent?.event });
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
          if (validJsonString(message)) {
            printMessage("Received message from an admin:", "info");
            console.log(JSON.parse(message));
            const { type, data } = JSON.parse(message);
            if (type && data) {
              // If created new raffle
              if (type === "raffle-create") {
                await makeRaffle({ ...data, mode: "manual" });
              }

              // If created new betting
              if (type === "betting-create") {
                await makeBetting(data);
              }

              // If finish betting manually
              if (type === "betting-finish-manually") {
                await doneBetting(data, "doneintime");
              }

              // If refund the betting
              if (type === "betting-refund") {
                await refundBetting(data);
              }

              // If select the winner of betting
              if (type === "betting-calculate") {
                await calculateBetting(data);
              }
            }
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
      // TODO: for dev
    });
  } catch (err) {
    printMessage(err, "error");
  }
};

server.listen(port, () => {
  printMessage(`Chatbot is running on port ${port}`, "info");
  init();
});
