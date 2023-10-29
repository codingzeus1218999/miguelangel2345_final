import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Link, useParams } from "react-router-dom";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { MetroSpinner } from "react-spinners-kit";
import Switch from "react-switch";

import Layout from "../../components/layout";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import PasswordInput from "../../components/ui/PasswordInput";
import TextArea from "../../components/ui/TextArea";
import AvatarUpload from "../../components/ui/AvatarUpload";

import { NavContext } from "../../context/NavContext";

import {
  changeUserPassword,
  getUserInfoById,
  changeUserInfo,
  changeUserModerator,
  changeUserState,
  changeUserRole,
} from "../../apis";
import { commafy } from "../../utils";

export default function EditUser() {
  const { setNav } = useContext(NavContext);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});

  const onClickModeratorSwitch = async (moderator) => {
    try {
      const res = await changeUserModerator({
        email: userInfo.email,
        moderator,
      });
      setUserInfo(res.user);
      NotificationManager.success(
        moderator ? "Now moderator" : "Not moderator"
      );
    } catch (err) {
      NotificationManager.error(
        "Something was wrong in connection with server"
      );
    }
  };

  const onClickStateSwitch = async (state) => {
    try {
      const res = await changeUserState({ email: userInfo.email, state });
      setUserInfo(res.user);
      NotificationManager.success(state ? "Allowed" : "Blocked");
    } catch (err) {
      NotificationManager.error(
        "Something was wrong in connection with server"
      );
    }
  };

  const onClickRoleSwitch = async (checked) => {
    try {
      const res = await changeUserRole({
        email: userInfo.email,
        role: checked ? "admin" : "user",
      });
      setUserInfo(res.user);
      NotificationManager.success(
        checked ? "Switched to Admin" : "Switched to User"
      );
    } catch (err) {
      NotificationManager.error(
        "Something was wrong in connection with server"
      );
    }
  };

  useEffect(() => {
    setNav("users");
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfoById(id);
        setUserInfo(data.user);
      } catch (err) {
        NotificationManager.error(
          "Something was wrong in connection with server"
        );
      }
    };
    fetchUserInfo();
  }, [setNav, id]);

  return (
    <Layout>
      <h1 className="page-title">Edit User</h1>
      <Link to="/users" className="mt-6 block w-fit">
        <Button>back to list</Button>
      </Link>
      <div className="mt-6">
        {Object.keys(userInfo).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex flex-row justify-center">
                <AvatarUpload email={userInfo.email} avatar={userInfo.avatar} />
              </div>
              <div className="mt-6">
                <Formik
                  initialValues={{
                    email: userInfo.email,
                    points: commafy(userInfo.points),
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
                  email: userInfo.email,
                  name: userInfo.name,
                  bio: userInfo.bio,
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string().required("This field is required"),
                })}
                onSubmit={async (values, actions) => {
                  try {
                    const res = await changeUserInfo(values);
                    setUserInfo(res.user);
                    NotificationManager.success("Changed successfuly");
                  } catch (err) {
                    NotificationManager.error(
                      "Something was wrong on changing user info"
                    );
                  }
                }}
              >
                {({ isValid, isSubmitting }) => (
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
                  </Form>
                )}
              </Formik>
            </div>
            <div>
              <Formik
                initialValues={{
                  email: userInfo.email,
                  password: "",
                }}
                validationSchema={Yup.object().shape({
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
                onSubmit={async (values, actions) => {
                  try {
                    const res = await changeUserPassword(values);
                    setUserInfo(res.user);
                    NotificationManager.success("Password changed");
                  } catch (err) {
                    NotificationManager.error(
                      "Something was wrong on changing password"
                    );
                  }
                }}
              >
                {({ isValid, isSubmitting }) => (
                  <Form>
                    <Field
                      name="password"
                      component={PasswordInput}
                      placeholder="new password"
                      checkDisplay={true}
                    />
                    <Button
                      className="w-full text-black mt-6"
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
                  </Form>
                )}
              </Formik>
              <div className="mt-6 flex flex-row gap-6 items-center">
                <span className="text-white font-bold tex-lg">Moderator: </span>
                <Switch
                  checked={userInfo.isModerator}
                  onChange={onClickModeratorSwitch}
                />
              </div>
              <div className="mt-6 flex flex-row gap-6 items-center">
                <span className="text-white font-bold tex-lg">State: </span>
                <Switch
                  checked={userInfo.allowed}
                  onChange={onClickStateSwitch}
                />
              </div>
              <div className="mt-6 flex flex-row gap-6 items-center">
                <span className="text-white font-bold tex-lg">
                  Admin role:{" "}
                </span>
                <Switch
                  checked={userInfo.role === "admin"}
                  onChange={onClickRoleSwitch}
                />
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-center text-white text-2xl">
            There is no an account with this id
          </h1>
        )}
      </div>
    </Layout>
  );
}
