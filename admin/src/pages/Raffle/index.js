import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MetroSpinner } from "react-spinners-kit";

import Layout from "../../components/layout";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import NumberInput from "../../components/ui/NumberInput";
import PageSpinner from "../../components/form/PageSpinner";

import { NavContext } from "../../context/NavContext";

import { getRaffleList } from "../../apis";
import constants from "../../constants";

export default function Raffle() {
  const { setNav } = useContext(NavContext);
  const [socket, setSocket] = useState(null);
  const [count, setCount] = useState(20);
  const [raffles, setRaffles] = useState([]);
  const [onPending, setOnPending] = useState(true);
  const [visible, setVisible] = useState(false);
  const fetchRaffles = async () => {
    try {
      setVisible(false);
      const res = await getRaffleList(count);
      setRaffles([...res.raffles]);
      setVisible(true);
    } catch (err) {
      NotificationManager.error("Something was wrong with backend");
      setVisible(false);
    }
  };

  useEffect(() => {
    setNav("raffle");
    fetchRaffles();
    const newSocket = new WebSocket(constants.CHATBOT_WS_URL);
    newSocket.onopen = () => {
      NotificationManager.success("Websocket connected with the chatbot");
    };
    newSocket.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data);
      if (type === "raffle-created")
        setRaffles((prevState) => [data, ...prevState]);
      if (type === "raffle-done") {
        setRaffles((prevState) => {
          const temp = [...prevState];
          temp[0] = data;
          return temp;
        });
      }
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
  useEffect(() => {
    fetchRaffles();
  }, [count]);
  useEffect(() => {
    setOnPending(raffles.some((r) => r.state === "pending"));
  }, [raffles]);

  return (
    <Layout>
      {visible ? (
        <>
          <h1 className="page-title">Raffle</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="notice-panel md:col-span-3">
              <h1 className="notice-panel-title">New Raffle</h1>
              <div className="notice-panel-div">
                <Formik
                  initialValues={{
                    name: "",
                    points: 1,
                    time: 10,
                    winnerCount: 1,
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required("This field is required"),
                    points: Yup.number()
                      .min(1, "Minimum points is 1")
                      .required("This field is required"),
                    time: Yup.number()
                      .min(10, "Minimum time is 10s")
                      .required("This field is required"),
                    winnerCount: Yup.number()
                      .min(1, "Winners are at least 1 member.")
                      .required("This field is required"),
                  })}
                  onSubmit={async (values, actions) => {
                    try {
                      socket.send(
                        JSON.stringify({ type: "raffle-create", data: values })
                      );
                      actions.resetForm();
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                      actions.setSubmitting(false);
                    }
                  }}
                >
                  {({ isValid, isSubmitting }) => (
                    <Form>
                      <Field
                        name="name"
                        component={TextInput}
                        readOnly={onPending}
                        placeholder="Raffle title"
                      />
                      <Field
                        name="points"
                        component={NumberInput}
                        readOnly={onPending}
                        placeholder="points to a winner"
                        className="mt-6"
                      />
                      <Field
                        name="time"
                        component={NumberInput}
                        readOnly={onPending}
                        placeholder="time (s)"
                        className="mt-6"
                      />
                      <Field
                        name="winnerCount"
                        component={NumberInput}
                        readOnly={onPending}
                        placeholder="count of winners"
                        className="mt-6"
                      />
                      <Button
                        type="submit"
                        disabled={!isValid || isSubmitting || onPending}
                        className="mt-6"
                      >
                        {isSubmitting ? (
                          <div className="mx-auto w-fit">
                            <MetroSpinner color="#000000" size={25} />
                          </div>
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="notice-panel md:col-span-9">
              <h1 className="notice-panel-title">Raffles</h1>
              <div className="notice-panel-div">
                {raffles.map((r, index) => (
                  <div key={index}>
                    <span>
                      {r.name} Raffle / {r.points} Points / {r.time} Seconds /{" "}
                      {r.winnerCount} Winners
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="ws-msg-date">
                      ({moment(r.created_at).format("hh:mm:ss MM/DD")})
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <span className={`raffle-state ${r.state}`}>{r.state}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Button onClick={() => setCount(count + 20)}>Load more</Button>
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
