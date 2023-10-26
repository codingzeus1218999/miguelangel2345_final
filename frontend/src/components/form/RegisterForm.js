import { useContext } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MetroSpinner } from "react-spinners-kit";
import { NotificationManager } from "react-notifications";

import { ModalContext } from "../../context/ModalContext";

import LogoImage from "../../assets/images/logo.svg";
import CloseImage from "../../assets/images/close.svg";

import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import PasswordInput from "../ui/PasswordInput";
import CheckBox from "../ui/CheckBox";
import { registerApi } from "../../utils/api";

export default function RegisterForm() {
  const { modal, setModal } = useContext(ModalContext);

  return (
    <div>
      <div className="flex justify-between items-center">
        <img alt="logo" src={LogoImage} width={56} />
        <img
          alt="close"
          src={CloseImage}
          onClick={() => setModal("")}
          className="cursor-pointer"
        />
      </div>
      <h1 className="font-semibold text-2xl mt-4">Welcome to CalssyBeef</h1>
      <div className="mt-4 flex gap-1">
        <div
          className={`switch-type ${modal === "login" ? "active" : ""}`}
          onClick={() => setModal("login")}
        >
          Log in
        </div>
        <div
          className={`switch-type ${modal === "register" ? "active" : ""}`}
          onClick={() => setModal("register")}
        >
          Create New Account
        </div>
      </div>
      <div className="rounded-md bg-pt-black-100 mt-4 p-4">
        <Formik
          initialValues={{
            email: "",
            password: "",
            name: "",
            agreement: false,
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .required("This field is required")
              .email("Email is not valid"),
            password: Yup.string()
              .required("This field is required")
              .matches(/[a-zA-Z]/, "Password must contain at least on letter")
              .matches(/^(?=.*\d)/, "Password must contain at least one number")
              .matches(
                /^(?=.*[!@#$%^&*])/g,
                "Password must contain at least one special character"
              )
              .min(8, "Password must be at least 8 characters"),
            name: Yup.string().required("This field is required"),
            agreement: Yup.boolean().oneOf(
              [true],
              "You must agree to the terms and conditions"
            ),
          })}
          onSubmit={(values, actions) => {
            registerApi(
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
          {({ isSubmitting, isValid }) => (
            <Form className="text-black">
              <Field name="email" component={TextInput} placeholder="email" />
              <Field
                name="password"
                component={PasswordInput}
                placeholder="password"
                className="mt-2"
                checkDisplay={true}
              ></Field>
              <Field
                name="name"
                component={TextInput}
                placeholder="kick username"
                className="mt-2"
              ></Field>
              <Field
                name="agreement"
                component={CheckBox}
                className="mt-2"
                title="I confirm that I am 18 year or older and that I agree to the T&C"
              ></Field>
              <Button
                type="submit"
                className="w-full text-black mt-2"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <div className="mx-auto w-fit">
                    <MetroSpinner color="#000000" size="25" />
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
