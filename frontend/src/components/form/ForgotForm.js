import { useContext } from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { NotificationManager } from "react-notifications";

import { IconBack } from "../../assets/images";

import { Button, TextInput } from "../ui";

import { ModalContext } from "../../context/ModalContext";
import { forgotPasswordApi } from "../../apis";

export default function ForgotForm() {
  const { setModal } = useContext(ModalContext);

  return (
    <div>
      <span className="cursor-pointer" onClick={() => setModal("login")}>
        <img alt="back" src={IconBack} className="inline-block" />
        Log in
      </span>
      <h1 className="mt-4 font-semibold text-2xl">Forgot Password</h1>
      <div className="rounded-md bg-pt-black-100 mt-4 p-4">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .required("This field is required")
              .email("Email is not valid"),
          })}
          onSubmit={(values, actions) => {
            forgotPasswordApi(
              values,
              (res) => {
                actions.setSubmitting(false);
                setModal("");
                NotificationManager.info(
                  "Email sent. Please check your mailbox."
                );
              },
              (err) => {
                actions.setSubmitting(false);
                err.response.data.success === false
                  ? NotificationManager.error(err.response.data.message)
                  : NotificationManager.error(
                      "Something is wrong, please try again."
                    );
              }
            );
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <Field name="email" component={TextInput} placeholder="email" />
              <h1 className="mt-2">
                We'll send you a link so you can reset your password
              </h1>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="text-black w-full mt-2"
              >
                Reset
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
