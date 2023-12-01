import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { MetroSpinner } from "react-spinners-kit";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Layout from "../../components/layout";
import {
  TextInput,
  Button,
  TextArea,
  NumberInput,
  SwitchField,
} from "../../components/ui";
import { NavContext } from "../../context/NavContext";

import {
  getChatbotSettingsGeneral,
  createChatbotSettingsGeneral,
  updateChatbotSettingsGeneral,
  getChatbotSettingsCommand,
  createChatbotSettingsCommand,
  updateChatbotSettingsCommand,
} from "../../apis";
import { PageSpinner } from "../../components/form";

export default function ChatbotSettings1() {
  const { setNav } = useContext(NavContext);
  const [generalSettings, setGeneralSettings] = useState({});
  const [commandSettings, setCommandSettings] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setNav("chatbot-settings-1");
    const fetchSettings = async () => {
      try {
        setVisible(false);
        const res = await getChatbotSettingsGeneral();
        setGeneralSettings(res?.settings);
        try {
          const res = await getChatbotSettingsCommand();
          setCommandSettings(res?.settings);
          setVisible(true);
        } catch (err) {
          NotificationManager.error(
            "Something was wrong in connection with server"
          );
        }
      } catch (err) {
        NotificationManager.error(
          "Something was wrong in connection with server"
        );
      }
    };
    fetchSettings();
  }, [setNav]);

  return (
    <Layout>
      {visible ? (
        <>
          <h1 className="page-title">Chatbot Settings 1</h1>
          <h1 className="danger-title mt-6">
            &#9888; After creating or updating these settings, please restart
            the chatbot application.
          </h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h1 className="mb-4 text-white font-bold">General Settings</h1>
              <Formik
                initialValues={{
                  channel1: generalSettings?.channel1,
                  channel2: generalSettings?.channel2,
                  wsEndPoint: generalSettings?.ws_end_point,
                  description: generalSettings?.description,
                  activeDuration: generalSettings?.activeDuration,
                  timeDuration: generalSettings?.time_duration,
                  pointsUnit: generalSettings?.points_unit,
                  subscriberMultiple: generalSettings?.subscriber_multiple,
                  subscriberPoints: generalSettings?.subscriber_points,
                  autoRaffle: generalSettings?.autoRaffle,
                  autoRafflePoints: generalSettings?.autoRafflePoints,
                  autoRaffleTime: generalSettings?.autoRaffleTime,
                  autoRaffleBetween: generalSettings?.autoRaffleBetween,
                  autoRaffleWinnerCount: generalSettings?.autoRaffleWinnerCount,
                  email: generalSettings?.email,
                  password: generalSettings?.password,
                }}
                validationSchema={Yup.object().shape({
                  channel1: Yup.string().required("This field is required"),
                  channel2: Yup.string().required("This field is required"),
                  wsEndPoint: Yup.string().required("This field is required"),
                  activeDuration: Yup.number("This field should be number").min(
                    1,
                    "Minimum duration is 1s"
                  ),
                  timeDuration: Yup.number("This field should be number").min(
                    1,
                    "Minimum duration is 1s"
                  ),
                  pointsUnit: Yup.number("This field should be number").min(
                    1,
                    "Minimum points is 1"
                  ),
                  subscriberMultiple: Yup.number(
                    "This field should be number"
                  ).min(1, "Minimum value is 1"),
                  subscriberPoints: Yup.number(
                    "This field should be number"
                  ).min(1, "Minimum value is 1"),
                  autoRaffle: Yup.boolean("This field should be boolean"),
                  autoRafflePoints: Yup.number(
                    "This field should be number"
                  ).min(1, "Minimum value is 1"),
                  autoRaffleTime: Yup.number("This field should be number").min(
                    1,
                    "Minimum value is 1"
                  ),
                  autoRaffleBetween: Yup.number(
                    "This field should be number"
                  ).min(1, "Minimum value is 1"),
                  autoRaffleWinnerCount: Yup.number(
                    "This field should be number"
                  ).min(1, "Minimum value is 1"),
                  email: Yup.string()
                    .required("This field is required")
                    .email("Email is not valid"),
                  password: Yup.string().required("This field is required"),
                })}
                onSubmit={async (values, actions) => {
                  if (generalSettings) {
                    try {
                      const res = await updateChatbotSettingsGeneral(values);
                      actions.setSubmitting(false);
                      if (res.success) {
                        NotificationManager.success(
                          "General settings were changed successfuly"
                        );
                      }
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                      actions.setSubmitting(false);
                    }
                  } else {
                    try {
                      const res = await createChatbotSettingsGeneral(values);
                      actions.setSubmitting(false);
                      if (res.success) {
                        setGeneralSettings(res.settings);
                        NotificationManager.success(
                          "Settings were created successfuly"
                        );
                      }
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                      actions.setSubmitting(false);
                    }
                  }
                }}
              >
                {({ isValid, isSubmitting }) => (
                  <Form>
                    <Field
                      name="wsEndPoint"
                      component={TextArea}
                      placeholder="websocket end point"
                      rows={4}
                    />
                    <Field
                      name="channel1"
                      component={TextInput}
                      placeholder="channel - 1"
                      className="mt-6"
                    />
                    <Field
                      name="channel2"
                      component={TextInput}
                      placeholder="channel - 2"
                      className="mt-6"
                    />
                    <Field
                      name="description"
                      component={TextArea}
                      placeholder="description"
                      className="mt-6"
                      rows={4}
                    />
                    <Field
                      name="activeDuration"
                      component={NumberInput}
                      placeholder="active duration (s)"
                      className="mt-6"
                    />
                    <Field
                      name="timeDuration"
                      component={NumberInput}
                      placeholder="duration to add points to active users (s)"
                      className="mt-6"
                    />
                    <Field
                      name="pointsUnit"
                      component={NumberInput}
                      placeholder="adding points unit"
                      className="mt-6"
                    />
                    <Field
                      name="subscriberMultiple"
                      component={NumberInput}
                      placeholder="subscriber multiple"
                      className="mt-6"
                    />
                    <Field
                      name="subscriberPoints"
                      component={NumberInput}
                      placeholder="points to new subscriber"
                      className="mt-6"
                    />
                    <Field
                      name="autoRaffle"
                      component={SwitchField}
                      placeholder="auto raffle"
                      className="mt-6"
                    />
                    <Field
                      name="autoRafflePoints"
                      component={NumberInput}
                      placeholder="points to add to auto raffle winner"
                      className="mt-6"
                    />
                    <Field
                      name="autoRaffleTime"
                      component={NumberInput}
                      placeholder="duration one raffle (s)"
                      className="mt-6"
                    />
                    <Field
                      name="autoRaffleBetween"
                      component={NumberInput}
                      placeholder="duration between auto raffles (s)"
                      className="mt-6"
                    />
                    <Field
                      name="autoRaffleWinnerCount"
                      component={NumberInput}
                      placeholder="count of winners in auto raffle"
                      className="mt-6"
                    />
                    <Field
                      name="email"
                      component={TextInput}
                      placeholder="Bot email"
                      className="mt-6"
                    />
                    <Field
                      name="password"
                      component={TextInput}
                      placeholder="Bot password"
                      className="mt-6"
                    />
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="mt-6"
                    >
                      {isSubmitting ? (
                        <div className="mx-auto w-fit">
                          <MetroSpinner color="#000000" size={25} />
                        </div>
                      ) : generalSettings ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div>
              <h1 className="mb-4 text-white font-bold">Command Settings</h1>
              <Formik
                initialValues={{
                  raffleStart: commandSettings?.raffleStart,
                  useRaffleCommand: commandSettings?.useRaffleCommand,
                  raffleJoin: commandSettings?.raffleJoin,
                  raffleEnd: commandSettings?.raffleEnd,
                  raffleNotReady: commandSettings?.raffleNotReady,
                  raffleCant: commandSettings?.raffleCant,
                  pointsRemaining: commandSettings?.pointsRemaining,
                  pointsRemainingMsg: commandSettings?.pointsRemainingMsg,
                  pointsRemainingNotRegistered:
                    commandSettings?.pointsRemainingNotRegistered,
                  addPointsMsg: commandSettings?.addPointsMsg,
                  addPointsMsgSuccess: commandSettings?.addPointsMsgSuccess,
                  addPointsMsgNotPermission:
                    commandSettings?.addPointsMsgNotPermission,
                  delPointsMsg: commandSettings?.delPointsMsg,
                  delPointsMsgSuccess: commandSettings?.delPointsMsgSuccess,
                  delPointsMsgNotPermission:
                    commandSettings?.delPointsMsgNotPermission,
                }}
                validationSchema={Yup.object().shape({
                  raffleStart: Yup.string().required("This field is required"),
                  raffleJoin: Yup.string().required("This field is required"),
                  raffleEnd: Yup.string().required("This field is required"),
                  raffleNotReady: Yup.string().required(
                    "This field is required"
                  ),
                  raffleCant: Yup.string().required("This field is required"),
                  pointsRemaining: Yup.string().required(
                    "This field is required"
                  ),
                  pointsRemainingMsg: Yup.string().required(
                    "This field is required"
                  ),
                  pointsRemainingNotRegistered: Yup.string().required(
                    "This field is required"
                  ),
                  addPointsMsg: Yup.string().required("This field is required"),
                  addPointsMsgSuccess: Yup.string().required(
                    "This field is required"
                  ),
                  addPointsMsgNotPermission: Yup.string().required(
                    "This field is required"
                  ),
                  delPointsMsg: Yup.string().required("This field is required"),
                  delPointsMsgSuccess: Yup.string().required(
                    "This field is required"
                  ),
                  delPointsMsgNotPermission: Yup.string().required(
                    "This field is required"
                  ),
                })}
                onSubmit={async (values, actions) => {
                  if (commandSettings) {
                    try {
                      const res = await updateChatbotSettingsCommand(values);
                      actions.setSubmitting(false);
                      if (res.success) {
                        NotificationManager.success(
                          "Command settings were changed successfuly"
                        );
                      }
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                      actions.setSubmitting(false);
                    }
                  } else {
                    try {
                      const res = await createChatbotSettingsCommand(values);
                      actions.setSubmitting(false);
                      if (res.success) {
                        setCommandSettings(res.settings);
                        NotificationManager.success(
                          "Settings were created successfuly"
                        );
                      }
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                      actions.setSubmitting(false);
                    }
                  }
                }}
              >
                {({ isValid, isSubmitting }) => (
                  <Form>
                    <Field
                      name="raffleStart"
                      component={TextInput}
                      placeholder="Raffle start message"
                    />
                    <Field
                      name="useRaffleCommand"
                      component={SwitchField}
                      placeholder="Use or not raffle commands"
                      className="mt-6"
                    />
                    <Field
                      name="raffleJoin"
                      component={TextInput}
                      placeholder="Raffle join command"
                      className="mt-6"
                    />
                    <Field
                      name="raffleEnd"
                      component={TextInput}
                      placeholder="Raffle result message"
                      className="mt-6"
                    />
                    <Field
                      name="raffleNotReady"
                      component={TextInput}
                      placeholder="Raffle not ready message"
                      className="mt-6"
                    />
                    <Field
                      name="raffleCant"
                      component={TextInput}
                      placeholder="Can't participate message"
                      className="mt-6"
                    />
                    <Field
                      name="pointsRemaining"
                      component={TextInput}
                      placeholder="Remaining points command"
                      className="mt-6"
                    />
                    <Field
                      name="pointsRemainingMsg"
                      component={TextInput}
                      placeholder="Remaining points message"
                      className="mt-6"
                    />
                    <Field
                      name="pointsRemainingNotRegistered"
                      component={TextInput}
                      placeholder="Remaining points message for unregistered user"
                      className="mt-6"
                    />
                    <Field
                      name="addPointsMsg"
                      component={TextInput}
                      placeholder="Add points command"
                      className="mt-6"
                    />
                    <Field
                      name="addPointsMsgSuccess"
                      component={TextInput}
                      placeholder="Success message in adding points"
                      className="mt-6"
                    />
                    <Field
                      name="addPointsMsgNotPermission"
                      component={TextInput}
                      placeholder="Not permission message in adding points"
                      className="mt-6"
                    />
                    <Field
                      name="delPointsMsg"
                      component={TextInput}
                      placeholder="Delete points command"
                      className="mt-6"
                    />
                    <Field
                      name="delPointsMsgSuccess"
                      component={TextInput}
                      placeholder="Success message in deleting points"
                      className="mt-6"
                    />
                    <Field
                      name="delPointsMsgNotPermission"
                      component={TextInput}
                      placeholder="Not permission message in deleting points"
                      className="mt-6"
                    />
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="mt-6"
                    >
                      {isSubmitting ? (
                        <div className="mx-auto w-fit">
                          <MetroSpinner color="#000000" size={25} />
                        </div>
                      ) : commandSettings ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      ) : (
        <PageSpinner />
      )}
    </Layout>
  );
}
