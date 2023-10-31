import { useContext } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { NotificationManager } from "react-notifications";
import { MetroSpinner } from "react-spinners-kit";

import { Logo, IconClose } from "../../assets/images";

import { Button, TextInput, PasswordInput, CheckBox } from "../ui";

import { UserContext } from "../../context/UserContext";
import { ModalContext } from "../../context/ModalContext";

import { loginApi } from "../../apis";

export default function LoginForm() {
  const { modal, setModal } = useContext(ModalContext);
  const { setIsAuthenticated, setAccount } = useContext(UserContext);

  return (
    <div>
      <div className="flex justify-between items-center">
        <img alt="logo" src={Logo} width={56} />
        <img
          alt="close"
          src={IconClose}
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
            rememberMe: false,
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .required("This field is required")
              .email("Email is not valid"),
            password: Yup.string().required("This field is required"),
          })}
          onSubmit={(values, actions) => {
            loginApi(
              values,
              (res) => {
                actions.setSubmitting(false);
                setModal("");
                localStorage.setItem("token", res.data.token);
                setAccount(res.data.user);
                setIsAuthenticated(true);
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
              <Field
                name="password"
                component={PasswordInput}
                placeholder="password"
                className="mt-2"
                checkDisplay={false}
              ></Field>
              <Field
                name="rememberMe"
                component={CheckBox}
                className="mt-2"
                title="Remember me"
              ></Field>
              <Button
                className="w-full text-black mt-2"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <div className="mx-auto w-fit">
                    <MetroSpinner color="#000000" size={25} />
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>
            </Form>
          )}
        </Formik>
        <h1 className="mt-2">
          Used to log in with twitch?&nbsp;&nbsp;&nbsp;
          <span className="font-bold underline cursor-pointer">
            Log in here
          </span>
        </h1>
        <h1 className="mt-2">
          Forgot Password?&nbsp;&nbsp;&nbsp;
          <span
            onClick={() => setModal("forgot")}
            className="font-bold underline cursor-pointer"
          >
            Reset here
          </span>
        </h1>
      </div>
    </div>
  );
}
