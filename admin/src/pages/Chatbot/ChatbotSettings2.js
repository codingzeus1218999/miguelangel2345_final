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
  getChatbotSettingsAdditionalCommands,
  createChatbotSettingsAdditionalCommand,
  updateChatbotSettingsAdditionalCommand,
  deleteChatbotSettingsAdditionalCommand,
} from "../../apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMultiply } from "@fortawesome/free-solid-svg-icons";

export default function ChatbotSettings2() {
  const { setNav } = useContext(NavContext);
  const [additionalCommands, setAdditionalCommands] = useState([]);
  const [timerSettings, setTimerSettings] = useState([]);
  const [addCommandState, setAddCommandState] = useState(false);
  const [addTimerState, setAddTimerState] = useState(false);

  useEffect(() => {
    setNav("chatbot-settings-2");
    const fetchAdditionalCommands = async () => {
      try {
        const res = await getChatbotSettingsAdditionalCommands("all");
        if (res.success) {
          setAdditionalCommands(res.data.settings);
        } else {
          NotificationManager.error(res.message);
        }
      } catch (err) {
        console.log(err);
        NotificationManager.error(
          "Something went wrong in connection with server"
        );
      }
    };
    fetchAdditionalCommands();
  }, [setNav]);

  const onClickDeleteAdditionalCommand = async (id) => {
    try {
      const res = await deleteChatbotSettingsAdditionalCommand(id);
      if (res.success) {
        setAdditionalCommands(res.data.settings);
      } else {
        NotificationManager.error(res.message);
      }
    } catch (err) {
      console.log(err);
      NotificationManager.error(
        "Something went wrong in connection with server"
      );
    }
  };

  return (
    <Layout>
      <>
        <h1 className="page-title">Chatbot Settings 2</h1>
        <h1 className="danger-title mt-6">
          &#9888; After creating or updating these settings, please restart the
          chatbot application.
        </h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex flex-row gap-10 items-center">
              <h1 className="text-white font-bold">
                Additional Commands Settings
              </h1>
              <FontAwesomeIcon
                icon={addCommandState ? faMultiply : faAdd}
                color="#ffffff"
                size="xl"
                className="cursor-pointer"
                onClick={() => setAddCommandState((prev) => !prev)}
              />
            </div>
            <div>
              {addCommandState && (
                <div className="mt-4">
                  <Formik
                    initialValues={{ command: "", reply: "", allow: true }}
                    validationSchema={Yup.object().shape({
                      command: Yup.string().required("This field is required"),
                      reply: Yup.string().required("This field is required"),
                    })}
                    onSubmit={async (values, actions) => {
                      try {
                        const res =
                          await createChatbotSettingsAdditionalCommand(values);
                        if (res.success) {
                          setAdditionalCommands(res.data.settings);
                          setAddCommandState(false);
                          NotificationManager.success(res.message);
                        } else {
                          NotificationManager.error(res.message);
                        }
                      } catch (err) {
                        console.log(err);
                        NotificationManager.error(
                          "Something went wrong in connection with server"
                        );
                      } finally {
                        actions.setSubmitting(false);
                      }
                    }}
                  >
                    {({ isValid, isSubmitting }) => (
                      <Form>
                        <Field
                          name="command"
                          component={TextInput}
                          placeholder="command"
                        />
                        <Field
                          name="reply"
                          component={TextArea}
                          placeholder="reply message"
                          rows={2}
                          className="mt-1"
                        />
                        <Field
                          name="allow"
                          component={SwitchField}
                          placeholder="active"
                          className="mt-1"
                        />
                        <div className="flex flex-row justify-end">
                          <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="mt-1"
                          >
                            {isSubmitting ? (
                              <div className="mx-auto w-fit">
                                <MetroSpinner color="#000000" size={25} />
                              </div>
                            ) : (
                              "Create"
                            )}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
              <div className="mt-10 flex flex-col gap-10">
                {additionalCommands.map((c, idx) => (
                  <Formik
                    key={idx + Date.now()}
                    initialValues={{
                      command: c.command,
                      reply: c.reply,
                      allow: c.allow,
                    }}
                    validationSchema={Yup.object().shape({
                      command: Yup.string().required("This field is required"),
                      reply: Yup.string().required("This field is required"),
                    })}
                    onSubmit={async (values, actions) => {
                      try {
                        const res =
                          await updateChatbotSettingsAdditionalCommand({
                            id: c._id,
                            ...values,
                          });
                        if (res.success) {
                          setAdditionalCommands(res.data.settings);
                          NotificationManager.success(res.message);
                        } else {
                          NotificationManager.error(res.message);
                        }
                      } catch (err) {
                        console.log(err);
                        NotificationManager.error(
                          "Something went wrong in connection with server"
                        );
                      } finally {
                        actions.setSubmitting(false);
                      }
                    }}
                  >
                    {({ isValid, isSubmitting }) => (
                      <Form>
                        <Field
                          name="command"
                          component={TextInput}
                          placeholder="command"
                        />
                        <Field
                          name="reply"
                          component={TextArea}
                          placeholder="reply message"
                          rows={2}
                          className="mt-1"
                        />
                        <Field
                          name="allow"
                          component={SwitchField}
                          placeholder="active"
                          className="mt-1"
                        />
                        <div className="flex flex-row justify-end -mt-4 gap-4">
                          <Button
                            type="button"
                            onClick={() =>
                              onClickDeleteAdditionalCommand(c._id)
                            }
                          >
                            Delete
                          </Button>
                          <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="mx-auto w-fit">
                                <MetroSpinner color="#000000" size={25} />
                              </div>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}
