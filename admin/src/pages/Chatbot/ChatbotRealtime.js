import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { PageSpinner } from "../../components/form";
import constants from "../../constants";

export default function ChatbotRealtime() {
  const { setNav } = useContext(NavContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setNav("chatbot-realtime");
    const newSocket = new WebSocket(constants.CHATBOT_WS_URL);
    newSocket.onopen = () => {
      setVisible(true);
      NotificationManager.success("Websocket connected with the chatbot");
    };
    newSocket.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data);
      if (type === "message") setMessages((prevState) => [data, ...prevState]);
      if (type === "event") setEvents((prevState) => [data, ...prevState]);
    };
    newSocket.onclose = () => {
      NotificationManager.info("Websocket disconnected from the chatbot");
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
  return (
    <Layout>
      {visible ? (
        <>
          <h1 className="page-title">Chatbot Realtime</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="notice-panel">
              <h1 className="notice-panel-title">
                Messages
                <span
                  onClick={() => setMessages([])}
                  className="text-red-600 cursor-pointer float-right"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                </span>
              </h1>
              <h1 className="mb-4 flex flex-row gap-4 justify-center flex-wrap">
                <span className="ws-msg-user registered">Registered user</span>
                <span className="ws-msg-user">Unegistered user</span>
                <span className="ws-msg-user subscriber !bg-transparent">
                  Subscriber
                </span>
                <span className="ws-msg-user moderator !bg-transparent">
                  Moderator
                </span>
              </h1>
              <div className="notice-panel-div">
                {messages.map((msg, index) => (
                  <div key={index}>
                    <span
                      className={`ws-msg-user ${
                        msg.isRegistered && "registered"
                      } ${msg.isSubscriber && "subscriber"} ${
                        msg.isModerator && "moderator"
                      } `}
                    >
                      {msg.name}:{" "}
                    </span>
                    <span className="ws-msg-content">{msg.content}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="notice-panel">
              <h1 className="notice-panel-title">
                Events
                <span
                  onClick={() => setEvents([])}
                  className="text-red-600 cursor-pointer float-right"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                </span>
              </h1>
              <h1 className="mb-4 flex flex-row gap-4 justify-center flex-wrap">
                <span className="ws-event-event point">Points</span>
                <span className="ws-event-event raffle">Raffle</span>
                <span className="ws-event-event betting">Betting</span>
              </h1>
              <div className="notice-panel-div">
                {events.map((event, index) => (
                  <div key={index}>
                    <span
                      className={`ws-event-event ${
                        event.event.includes("Point") && "point"
                      } ${event.event.includes("Raffle") && "raffle"} ${event.event.includes("Betting") && "betting"}`}
                    >
                      {event.event}:{" "}
                    </span>
                    <span className="ws-event-content">{event.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <PageSpinner />
      )}
    </Layout>
  );
}
