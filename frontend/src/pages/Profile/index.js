import { useContext, useEffect } from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import Layout from "../../components/layout";
import AvatarUpload from "../../components/ui/AvatarUpload";
import TextInput from "../../components/ui/TextInput";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";

import { NavContext } from "../../context/NavContext";
import { UserContext } from "../../context/UserContext";
import { commafy } from "../../utils/numberUtils";
import { changePassword, updateInfo } from "../../utils/api";
import { NotificationManager } from "react-notifications";

export default function Profile() {
  const { setNav } = useContext(NavContext);
  const { account, setAccount } = useContext(UserContext);
  useEffect(() => {
    setNav("profile");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">Profile</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex flex-row justify-center">
            <AvatarUpload />
          </div>
          <div className="mt-6">
            <Formik
              initialValues={{
                email: account.email,
                points: commafy(account.points),
              }}
            >
              {() => (
                <Form>
                  <Field
                    name="email"
                    component={TextInput}
                    placeholder="email"
                    readOnly={true}
                  />
                  <Field
                    name="points"
                    component={TextInput}
                    placeholder="points"
                    readOnly={true}
                    className="mt-6"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div>
          <Formik
            initialValues={{
              email: account.email,
              name: account.name,
              bio: account.bio,
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("This field is required"),
            })}
            onSubmit={(values, actions) => {
              updateInfo(
                values,
                (res) => {
                  NotificationManager.success(
                    "Your info was changed successfully"
                  );
                  setAccount({
                    ...account,
                    name: res.data.name,
                    bio: res.data.bio,
                  });
                },
                (err) => {
                  err.response.data.success === false
                    ? NotificationManager.error(err.response.data.message)
                    : NotificationManager.error(
                        "Something is wrong, please try again."
                      );
                }
              );
            }}
          >
            {({ isValid }) => (
              <Form>
                <Field
                  name="name"
                  component={TextInput}
                  placeholder="kick username"
                  readOnly={true}
                />
                <Field
                  name="bio"
                  component={TextArea}
                  rows={6}
                  placeholder="bio"
                  className="mt-6"
                />
                <Button
                  className="w-full text-black mt-6"
                  type="submit"
                  disabled={!isValid}
                >
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <div>
          <Formik
            initialValues={{
              email: account.email,
              oldPassword: "",
              newPassword: "",
            }}
            validationSchema={Yup.object().shape({
              oldPassword: Yup.string()
                .required("This field is required")
                .matches(/[a-zA-Z]/, "Password must contain at least on letter")
                .matches(
                  /^(?=.*\d)/,
                  "Password must contain at least one number"
                )
                .matches(
                  /^(?=.*[!@#$%^&*])/g,
                  "Password must contain at least one special character"
                )
                .min(8, "Password must be at least 8 characters"),
              newPassword: Yup.string()
                .required("This field is required")
                .matches(/[a-zA-Z]/, "Password must contain at least on letter")
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
              changePassword(
                values,
                (res) => {
                  NotificationManager.success(
                    "Your password was changed successfully"
                  );
                  setAccount({
                    ...account,
                    password: res.data.password,
                  });
                },
                (err) => {
                  err.response.data.success === false
                    ? NotificationManager.error(err.response.data.message)
                    : NotificationManager.error(
                        "Something is wrong, please try again."
                      );
                }
              );
            }}
          >
            {({ isValid }) => (
              <Form>
                <Field
                  name="oldPassword"
                  component={PasswordInput}
                  placeholder="old password"
                />
                <Field
                  name="newPassword"
                  component={PasswordInput}
                  placeholder="new password"
                  className="mt-6"
                  checkDisplay={true}
                />
                <Button
                  className="w-full text-black mt-6"
                  type="submit"
                  disabled={!isValid}
                >
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
}
