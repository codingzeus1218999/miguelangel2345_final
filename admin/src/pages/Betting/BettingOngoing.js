import { useContext, useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import Layout from "../../components/layout";
import { Button } from "../../components/ui";
import { PageSpinner } from "../../components/form";
import { NavContext } from "../../context/NavContext";
import constants from "../../constants";

export default function BettingOngoing() {
  const { setNav } = useContext(NavContext);
  const [socket, setSocket] = useState(null);
  const [visible, setVisible] = useState(false);
  const [latestBetting, setLatestbetting] = useState(null);
  const [pointsInfo, setPointsInfo] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [colors, setColors] = useState([]);

  const onClickFinishManually = () => {
    try {
      socket.send(
        JSON.stringify({
          type: "betting-finish-manually",
          data: { ...latestBetting },
        })
      );
    } catch (err) {
      NotificationManager.error("Something is wrong, please try again");
    }
  };
  const onClickCalculate = (betting, winOptionId) => {
    try {
      socket.send(
        JSON.stringify({
          type: "betting-calculate",
          data: { betting, winOptionId },
        })
      );
    } catch (err) {
      NotificationManager.error("Something is wrong, please try again");
    }
  };
  const onClickRefund = (betting) => {
    try {
      socket.send(
        JSON.stringify({
          type: "betting-refund",
          data: { ...betting },
        })
      );
    } catch (err) {
      NotificationManager.error("Something is wrong, please try again");
    }
  };
  const onClickCopyDetails = () => {
    localStorage.setItem("bettingOption", JSON.stringify(latestBetting));
    NotificationManager.info(
      `${latestBetting.title} betting's options has been copied`
    );
  };

  useEffect(() => {
    setNav("betting-ongoing");
    let cs = [];
    for (let i = 0; i < 100; i++) {
      cs.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    }
    setColors(cs);
    const newSocket = new WebSocket(constants.CHATBOT_WS_URL);
    newSocket.onopen = () => {
      NotificationManager.success("Websocket connected with the chatbot");
    };
    newSocket.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data);
      if (type === "betting-latest") {
        setLatestbetting(data);
        setVisible(true);
      }
    };
    newSocket.onclose = () => {
      NotificationManager.info("Websocket disconnected from the chatbot");
      newSocket.close();
      setVisible(false);
    };
    newSocket.onerror = () => {
      NotificationManager.error(
        "There is an error in websocket connection with chatbot"
      );
      setVisible(false);
    };
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setNav]);

  useEffect(() => {
    if (latestBetting && Object.keys(latestBetting).length > 0) {
      let t = 0;
      let info = [];
      for (let i = 0; i < latestBetting.options.length; i++) {
        let pp = {
          title: latestBetting.options[i].case,
          color: colors[i],
          point: 0,
        };
        for (let j = 0; j < latestBetting.options[i].participants.length; j++) {
          t += latestBetting.options[i].participants[j].amount;
          pp.point += latestBetting.options[i].participants[j].amount;
        }
        info.push({ ...pp });
      }
      setTotalPoints(t);
      setPointsInfo([...info]);
    }
  }, [latestBetting]);

  return (
    <Layout>
      {visible && latestBetting ? (
        <>
          <div className="mt-6">
            {Object.keys(latestBetting).length > 0 ? (
              <div className="notice-panel">
                <h1 className="notice-panel-title">
                  Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  {
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={onClickCopyDetails}
                    />
                  }
                </h1>
                <div className="notice-panel-div !max-h-none">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      {latestBetting.state === "pending" && (
                        <Button
                          onClick={() =>
                            onClickFinishManually({ ...latestBetting })
                          }
                        >
                          Finish
                        </Button>
                      )}
                      {latestBetting.state === "calculating" && (
                        <div className="flex gap-3">
                          {latestBetting.options.map((o, idx) => (
                            <Button
                              key={idx}
                              onClick={() =>
                                onClickCalculate({ ...latestBetting }, o._id)
                              }
                            >
                              {o.case}
                            </Button>
                          ))}
                          <Button
                            onClick={() => onClickRefund({ ...latestBetting })}
                          >
                            Refund
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Title: </h1>
                      <h1>{latestBetting.title}</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Description: </h1>
                      <h1>{latestBetting.description}</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Opitons: </h1>
                      <div className="flex flex-col gap-2">
                        {latestBetting.options.map((o, idx) => (
                          <div key={idx} className="flex gap-4">
                            <h1>case: {o.case}</h1>
                            <h1>command: {o.command}</h1>
                            <h1>selected: {o.winState ? "yes" : "no"}</h1>
                            <h1>
                              count of participants: {o.participants.length}
                            </h1>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Duration: </h1>
                      <h1>{latestBetting.duration} min</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Min amount to bet: </h1>
                      <h1>{latestBetting.minAmount} points</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Max amount to bet: </h1>
                      <h1>{latestBetting.maxAmount} points</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Created at: </h1>
                      <h1>
                        {moment(latestBetting.createdAt).format(
                          "hh:mm:ss MM/DD"
                        )}
                      </h1>
                    </div>
                    {latestBetting.state === "pending" && (
                      <div className="flex gap-4">
                        <h1 className="pt-label">Remaining time: </h1>
                        <h1>
                          {`${parseInt(
                            latestBetting.remainingSeconds / 60
                          )} min ${parseInt(
                            latestBetting.remainingSeconds % 60
                          )} s`}
                        </h1>
                      </div>
                    )}
                    <div className="flex gap-4 items-center">
                      <h1 className="pt-label">
                        Betting Points: ({totalPoints})
                      </h1>
                      <div className="bg-white flex-1 h-6 rounded-md flex items-center overflow-hidden">
                        {totalPoints !== 0 &&
                          pointsInfo.map((p, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: `${(p.point / totalPoints) * 100}%`,
                                backgroundColor: p.color,
                                textAlign: "center",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{`${p.title}(${p.point})`}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Participants: </h1>
                      {latestBetting.options.map((o, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                          <h1 className="pt-label">{o.case}</h1>
                          {o.participants.map((p, idx1) => (
                            <h3 key={idx1}>
                              {p.user.name} // {p.amount} points
                            </h3>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <h4 className="text-white text-4xl text-center font-bold">
                There is no any betting history
              </h4>
            )}
          </div>
        </>
      ) : (
        <PageSpinner />
      )}
    </Layout>
  );
}
