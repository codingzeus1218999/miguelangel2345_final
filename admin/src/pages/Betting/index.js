import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MetroSpinner } from "react-spinners-kit";

import Layout from "../../components/layout";
import {
  TextInput,
  Button,
  NumberInput,
  TextArea,
  BettingOptions,
} from "../../components/ui";
import { PageSpinner } from "../../components/form";

import { NavContext } from "../../context/NavContext";

import { getBettingList } from "../../apis";
import constants from "../../constants";

export default function Betting() {
  const { setNav } = useContext(NavContext);
  const [socket, setSocket] = useState(null);
  const [selectedBetting, setSelectedBetting] = useState(null);
  const [count, setCount] = useState(20);
  const [bettings, setBettings] = useState([]);
  const [onPending, setOnPending] = useState(true);
  const [visible, setVisible] = useState(false);
  const fetchBettings = async (loadMore = false) => {
    try {
      if (!loadMore) setVisible(false);
      const res = await getBettingList(count);
      if (res.success) {
        setBettings([...res.data.bettings]);
        setVisible(true);
      } else {
        NotificationManager.error(res.message);
        setVisible(false);
      }
    } catch (err) {
      NotificationManager.error("Something was wrong with backend");
      setVisible(false);
    }
  };

  useEffect(() => {
    setNav("betting");
    fetchBettings(false);
    const newSocket = new WebSocket(constants.CHATBOT_WS_URL);
    newSocket.onopen = () => {
      NotificationManager.success("Websocket connected with the chatbot");
    };
    newSocket.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data);
      if (type === "betting-created")
        setBettings((prevState) => [data, ...prevState]);
      if (type === "betting-finished") {
        setBettings((prevState) =>
          prevState.map((s) => (s._id === data._id ? data : s))
        );
        if (selectedBetting?._id === data._id) {
          setSelectedBetting(data);
        }
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
    fetchBettings(true);
  }, [count]);
  useEffect(() => {
    setOnPending(bettings.some((r) => r.state === "pending"));
  }, [bettings]);

  return (
    <Layout>
      {visible ? (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="notice-panel md:col-span-3">
              <h1 className="notice-panel-title">Bettings</h1>
              <div className="mb-3 flex gap-1 flex-wrap">
                <h1 className="betting-label pending">Pending</h1>
                <h1 className="betting-label calculating">Calculating</h1>
                <h1 className="betting-label doneontime">Done automatically</h1>
                <h1 className="betting-label doneintime">Done manually</h1>
                <h1 className="betting-label refunded">Refunded</h1>
              </div>
              <div className="notice-panel-div">
                <div className="text-center">
                  <Button
                    onClick={() => setSelectedBetting(null)}
                    disabled={onPending}
                  >
                    Create new betting
                  </Button>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  {bettings.map((b, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedBetting(b)}
                      className="cursor-pointer"
                    >
                      <h1 className={`betting-label ${b.state}`}>{b.title}</h1>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <Button onClick={() => setCount(count + 20)}>
                    Load more
                  </Button>
                </div>
              </div>
            </div>
            <div className="notice-panel md:col-span-9">
              <h1 className="notice-panel-title">Details</h1>
              <div className="notice-panel-div !max-h-none">
                {selectedBetting === null && (
                  <div>
                    <Formik
                      initialValues={{
                        title: "",
                        description: "",
                        options: [],
                        duration: 5,
                        minAmount: 10,
                        maxAmount: 100000,
                      }}
                      validationSchema={Yup.object().shape({
                        title: Yup.string().required("This field is required"),
                        duration: Yup.number()
                          .min(1, "Minimum duration is 1 min")
                          .required("This field is required"),
                        minAmount: Yup.number()
                          .min(10, "Minimum amount is 10 points")
                          .required("This field is required"),
                        maxAmount: Yup.number()
                          .min(10, "Maximum amount is 10 points")
                          .required("This field is required"),
                      })}
                      onSubmit={async (values, actions) => {
                        try {
                          socket.send(
                            JSON.stringify({
                              type: "betting-create",
                              data: values,
                            })
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
                            name="title"
                            component={TextInput}
                            readOnly={onPending}
                            placeholder="betting title"
                          />
                          <Field
                            name="options"
                            component={BettingOptions}
                            readOnly={onPending}
                            placeholder="betting options"
                            className="mt-6"
                            title="Add option"
                          />
                          <Field
                            name="duration"
                            component={NumberInput}
                            readOnly={onPending}
                            placeholder="time (min)"
                            className="mt-6"
                            min={1}
                          />
                          <Field
                            name="minAmount"
                            component={NumberInput}
                            readOnly={onPending}
                            placeholder="minimum points to bet"
                            className="mt-6"
                            min={10}
                          />
                          <Field
                            name="maxAmount"
                            component={NumberInput}
                            readOnly={onPending}
                            placeholder="maximum points to bet"
                            className="mt-6"
                            min={10}
                          />
                          <Field
                            name="description"
                            component={TextArea}
                            readOnly={onPending}
                            placeholder="betting description"
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
                )}
                {selectedBetting && (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <h1 className="pt-label">Title: </h1>
                      <h1>{selectedBetting.title}</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Description: </h1>
                      <h1>{selectedBetting.description}</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Opitons: </h1>
                      <div className="flex flex-col gap-2">
                        {selectedBetting.options.map((o, idx) => (
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
                      <h1>{selectedBetting.duration} min</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Min amount to bet: </h1>
                      <h1>{selectedBetting.minAmount} points</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Duration: </h1>
                      <h1>{selectedBetting.maxAmount} points</h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Created at: </h1>
                      <h1>
                        {moment(selectedBetting.createdAt).format(
                          "hh:mm:ss MM/DD"
                        )}
                      </h1>
                    </div>
                    <div className="flex gap-4">
                      <h1 className="pt-label">Finished at: </h1>
                      <h1>
                        {moment(selectedBetting.doneAt).format(
                          "hh:mm:ss MM/DD"
                        )}
                      </h1>
                    </div>
                  </div>
                )}
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
