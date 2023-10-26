import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { MetroSpinner } from "react-spinners-kit";

import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";

import { verifyPwdTokenApi, resetPasswordApi } from "../../utils/api";
import { NotificationManager } from "react-notifications";

export default function ResetPassword() {
  const navigator = useNavigate();

  const { token } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    verifyPwdTokenApi(
      token,
      (res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      },
      (err) => {
        err.response.data.success === false
          ? setErrMsg(err.response.data.message)
          : setErrMsg("Something is wrong.");
      }
    );
  }, [token]);
  return (
    <div className="flex flex-row justify-center items-center mt-32">
      <div className={`pt-box rounded-md ${name ? "p-4" : "p-12"}`}>
        {name ? (
          <div>
            <h1 className="text-white font-extrabold text-4xl text-center">
              Hi, {name}
            </h1>
            <div className="rounded-md  mt-4">
              <Formik
                initialValues={{
                  email: email,
                  password: "",
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .required("This field is required")
                    .email("Email is not valid"),
                  password: Yup.string()
                    .required("This field is required")
                    .matches(
                      /[a-zA-Z]/,
                      "Password must contain at least on letter"
                    )
                    .matches(
                      /^(?=.*\d)/,
                      "Password must contain at least one number"
                    )
                    .matches(
                      /^(?=.*[!@#$%^&*])/g,
                      "Password must contain at least one special character"
                    )
                    .min(8, "Password must be at least 8 characters"),
                })}
                onSubmit={(values, actions) => {
                  resetPasswordApi(
                    values,
                    (res) => {
                      actions.setSubmitting(false);
                      NotificationManager.success(
                        "The password has been reset"
                      );
                      localStorage.setItem("token", res.data.token);
                      setTimeout(() => {
                        navigator("/");
                      }, 2000);
                    },
                    (err) => {
                      actions.setSubmitting(false);
                      err.response.data.success === false
                        ? NotificationManager.error(err.response.data.message)
                        : NotificationManager.error("Something is wrong.");
                    }
                  );
                }}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <Field
                      name="password"
                      component={PasswordInput}
                      placeholder="password"
                      className="mt-2"
                      checkDisplay={true}
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
                        "Reset"
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-white font-extrabold text-4xl text-center">
              I'm so sorry
            </h1>
            <h1 className="text-white text-center mt-6">{errMsg}</h1>
            <Button className="mt-6" onClick={() => navigator("/")}>
              Return to homepage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
