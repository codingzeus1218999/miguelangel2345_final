import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { MetroSpinner } from "react-spinners-kit";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Layout from "../../components/layout";
import { TextInput, Button, TextArea } from "../../components/ui";
import { NavContext } from "../../context/NavContext";

import {
  getChatbotSettingsBet,
  createChatbotSettingsBet,
  updateChatbotSettingsBet,
} from "../../apis";
import { PageSpinner } from "../../components/form";

export default function ChatbotSettings3() {
  const { setNav } = useContext(NavContext);
  const [betSettings, setBetSettings] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setNav("chatbot-settings-3");
    const fetchSettings = async () => {
      try {
        setVisible(false);
        const res = await getChatbotSettingsBet();
        setBetSettings(res?.data.setting);
        setVisible(true);
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
          <h1 className="page-title">Chatbot Settings 3</h1>
          <h1 className="danger-title mt-6">
            &#9888; After creating or updating these settings, please restart
            the chatbot application.
          </h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h1 className="mb-4 text-white font-bold">Bet Settings</h1>
              <Formik
                initialValues={{
                  created: betSettings?.created,
                  joinSuccess: betSettings?.joinSuccess,
                  alreadyJoined: betSettings?.alreadyJoined,
                  notRegisteredUser: betSettings?.notRegisteredUser,
                  doneInTime: betSettings?.doneInTime,
                  doneOnTime: betSettings?.doneOnTime,
                  resultNotice: betSettings?.resultNotice,
                  pointsAmount: betSettings?.pointsAmount,
                  notEnough: betSettings?.notEnough,
                  distributedPoints: betSettings?.distributedPoints,
                  refundNotice: betSettings?.refundNotice,
                }}
                validationSchema={Yup.object().shape({
                  created: Yup.string().required("This field is required"),
                  joinSuccess: Yup.string().required("This field is required"),
                  alreadyJoined: Yup.string().required(
                    "This field is required"
                  ),
                  notRegisteredUser: Yup.string().required(
                    "This field is required"
                  ),
                  doneInTime: Yup.string().required("This field is required"),
                  doneOnTime: Yup.string().required("This field is required"),
                  resultNotice: Yup.string().required("This field is required"),
                  pointsAmount: Yup.string().required("This field is required"),
                  notEnough: Yup.string().required("This field is required"),
                  distributedPoints: Yup.string().required(
                    "This field is required"
                  ),
                  refundNotice: Yup.string().required("This field is required"),
                })}
                onSubmit={async (values, actions) => {
                  if (betSettings) {
                    try {
                      const res = await updateChatbotSettingsBet(values);
                      if (res.success) {
                        NotificationManager.success(res.message);
                      } else {
                        NotificationManager.error(res.message);
                      }
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                    } finally {
                      actions.setSubmitting(false);
                    }
                  } else {
                    try {
                      const res = await createChatbotSettingsBet(values);
                      if (res.success) {
                        setBetSettings(res.data.setting);
                        NotificationManager.success(res.message);
                      } else {
                        NotificationManager.error(res.message);
                      }
                    } catch (err) {
                      NotificationManager.error(
                        "Something is wrong, please try again"
                      );
                    } finally {
                      actions.setSubmitting(false);
                    }
                  }
                }}
              >
                {({ isValid, isSubmitting }) => (
                  <Form>
                    <Field
                      name="created"
                      component={TextArea}
                      placeholder="when new bet has been created"
                      rows={4}
                    />
                    <Field
                      name="joinSuccess"
                      component={TextInput}
                      placeholder="when a user joins"
                      className="mt-6"
                    />
                    <Field
                      name="alreadyJoined"
                      component={TextInput}
                      placeholder="when a user who already joined is trying to join again"
                      className="mt-6"
                    />
                    <Field
                      name="notRegisteredUser"
                      component={TextInput}
                      placeholder="when the not-registered user is trying to join"
                      className="mt-6"
                      rows={4}
                    />
                    <Field
                      name="doneInTime"
                      component={TextInput}
                      placeholder="when admin closes bet manually"
                      className="mt-6"
                    />
                    <Field
                      name="doneOnTime"
                      component={TextInput}
                      placeholder="when a bet has been closed automatically"
                      className="mt-6"
                    />
                    <Field
                      name="resultNotice"
                      component={TextInput}
                      placeholder="notice the bet result"
                      className="mt-6"
                    />
                    <Field
                      name="pointsAmount"
                      component={TextArea}
                      placeholder="points amount error message"
                      className="mt-6"
                    />
                    <Field
                      name="notEnough"
                      component={TextArea}
                      placeholder="when user have not enough points amount"
                      className="mt-6"
                    />
                    <Field
                      name="distributedPoints"
                      component={TextInput}
                      placeholder="notice to distribute to the winners"
                      className="mt-6"
                    />
                    <Field
                      name="refundNotice"
                      component={TextInput}
                      placeholder="when refund back the points to the users"
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
                      ) : betSettings ? (
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
