import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";

import Layout from "../../components/layout";
import { Button } from "../../components/ui";
import { NavContext } from "../../context/NavContext";
import { getChatbotEvents, getChatbotMessages } from "../../apis";
import { PageSpinner } from "../../components/form";

export default function ChatbotHistory() {
  const { setNav } = useContext(NavContext);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [msgCount, setMsgCount] = useState(50);
  const [eventCount, setEventCount] = useState(50);
  const [visibleM, setVisibleM] = useState(false);
  const [visibleE, setVisibleE] = useState(false);
  const fetchMessages = async () => {
    try {
      setVisibleM(false);
      const res = await getChatbotMessages(msgCount);
      setMessages([...res.messages]);
      setVisibleM(true);
    } catch (err) {
      NotificationManager.error("Something was wrong with backend");
    }
  };
  const fetchEvents = async () => {
    try {
      setVisibleE(false);
      const res = await getChatbotEvents(eventCount);
      setEvents([...res.events]);
      setVisibleE(true);
    } catch (err) {
      NotificationManager.error("Something was wrong with backend");
    }
  };

  useEffect(() => {
    setNav("chatbot-history");
    fetchMessages();
    fetchEvents();
  }, [setNav]);
  useEffect(() => {
    fetchMessages();
  }, [msgCount]);
  useEffect(() => {
    fetchEvents();
  }, [eventCount]);
  return (
    <Layout>
      {visibleM && visibleE ? (
        <>
          <h1 className="page-title">Chatbot History</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="notice-panel">
              <h1 className="notice-panel-title">Messages</h1>
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
                    &nbsp;&nbsp;&nbsp;
                    <span className="ws-msg-date">
                      ({moment(msg.created_at).format("hh:mm:ss MM/DD")})
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Button onClick={() => setMsgCount(msgCount + 50)}>
                  Load more
                </Button>
              </div>
            </div>
            <div className="notice-panel">
              <h1 className="notice-panel-title">Events</h1>
              <h1 className="mb-4 flex flex-row gap-4 justify-center flex-wrap">
                <span className="ws-event-event point">Points</span>
                <span className="ws-event-event raffle">Raffle</span>
              </h1>
              <div className="notice-panel-div">
                {events.map((event, index) => (
                  <div key={index}>
                    <span
                      className={`ws-event-event ${
                        event.event.includes("Point") && "point"
                      } ${event.event.includes("Raffle") && "raffle"}`}
                    >
                      {event.event}:{" "}
                    </span>
                    <span className="ws-event-content">{event.content}</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="ws-msg-date">
                      ({moment(event.created_at).format("hh:mm:ss MM/DD")})
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Button onClick={() => setEventCount(eventCount + 50)}>
                  Load more
                </Button>
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
