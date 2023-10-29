import { useEffect } from "react";
import { Field, Formik, Form } from "formik";
import { MetroSpinner } from "react-spinners-kit";
import * as Yup from "yup";
import Avatar from "react-avatar";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";

import TextInput from "../../components/ui/TextInput";
import PasswordInput from "../../components/ui/PasswordInput";
import CheckBox from "../../components/ui/CheckBox";
import Button from "../../components/ui/Button";

import { loginApi } from "../../apis";

import LogoImage from "../../assets/images/logo.svg";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/users");
    }
  }, [navigate]);

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-20">
      <Avatar src={LogoImage} />
      <h1 className="text-white font-bold text-2xl">Classybeef Admin</h1>
      <div className="rounded-md bg-pt-black-100 p-4 w-full sm:w-1/3">
        <Formik
          initialValues={{ email: "", password: "", rememberMe: false }}
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
                localStorage.setItem("token", res.data.token);
                navigate("/users");
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
      </div>
    </div>
  );
}
