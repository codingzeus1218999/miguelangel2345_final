import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { MetroSpinner } from "react-spinners-kit";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Layout from "../../components/layout";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import TextArea from "../../components/ui/TextArea";
import NumberInput from "../../components/ui/NumberInput";

import { NavContext } from "../../context/NavContext";

import {
  getChatbotSettingsGeneral,
  createChatbotSettingsGeneral,
  updateChatbotSettingsGeneral,
  getChatbotSettingsCommand,
  createChatbotSettingsCommand,
  updateChatbotSettingsCommand,
} from "../../utils/api";
import PageSpinner from "../../components/form/PageSpinner";

export default function ChatbotSettings() {
  const { setNav } = useContext(NavContext);
  const [generalSettings, setGeneralSettings] = useState({});
  const [commandSettings, setCommandSettings] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setNav("chatbot-settings");
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
          <h1 className="page-title">Chatbot Settings</h1>
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
                  timeDuration: generalSettings?.time_duration,
                  pointsUnit: generalSettings?.points_unit,
                  subscriberMultiple: generalSettings?.subscriber_multiple,
                  subscriberPoints: generalSettings?.subscriber_points,
                  email: generalSettings?.email,
                  password: generalSettings?.password,
                }}
                validationSchema={Yup.object().shape({
                  channel1: Yup.string().required("This field is required"),
                  channel2: Yup.string().required("This field is required"),
                  wsEndPoint: Yup.string().required("This field is required"),
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
                        actions.setValues({
                          channel1: res.settings.channel1,
                          channel2: res.settings.channel2,
                          wsEndPoint: res.settings.ws_end_point,
                          description: res.settings.description,
                          timeDuration: res.settings.time_duration,
                          pointsUnit: res.settings.points_unit,
                          subscriberMultiple: res.settings.subscriber_multiple,
                          subscriberPoints: res.settings.subscriber_points,
                          email: res.settings.email,
                          password: res.settings.password,
                        });
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
                      name="timeDuration"
                      component={NumberInput}
                      placeholder="watching time duration (s)"
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
                          <MetroSpinner color="#000000" size="25" />
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
                        actions.setValues({
                          raffleStart: res.settings.raffleStart,
                          raffleJoin: res.settings.raffleJoin,
                          raffleEnd: res.settings.raffleEnd,
                          raffleNotReady: res.settings.raffleNotReady,
                          raffleCant: res.settings.raffleCant,
                          pointsRemaining: res.settings.pointsRemaining,
                          pointsRemainingMsg: res.settings.pointsRemainingMsg,
                          pointsRemainingNotRegistered:
                            res.settings.pointsRemainingNotRegistered,
                          addPointsMsg: res.settings.addPointsMsg,
                          addPointsMsgSuccess: res.settings.addPointsMsgSuccess,
                          addPointsMsgNotPermission:
                            res.settings.addPointsMsgNotPermission,
                          delPointsMsg: res.settings.delPointsMsg,
                          delPointsMsgSuccess: res.settings.delPointsMsgSuccess,
                          delPointsMsgNotPermission:
                            res.settings.delPointsMsgNotPermission,
                        });
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
                          <MetroSpinner color="#000000" size="25" />
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
