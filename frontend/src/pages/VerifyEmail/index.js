import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

import Button from "../../components/ui/Button";

import { verifyEmailApi } from "../../apis";
import { NotificationManager } from "react-notifications";
import { Field, Form, Formik } from "formik";
import TextInput from "../../components/ui/TextInput";
import { MetroSpinner } from "react-spinners-kit";

export default function VerifyEmail() {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const verifyToken = async () => {
    try {
      const res = await verifyEmailApi(token);
      if (res.success) {
        setEmail(res.data.email);
      } else {
        NotificationManager.error(res.message);
      }
    } catch (err) {
      console.log(err);
      NotificationManager.error("Something went wrong in verifying token");
    }
  };
  useEffect(() => {
    verifyToken();
  }, [token]);
  return (
    <div className="flex flex-col justify-center items-center mt-32 gap-10">
      {email ? (
        <>
          <h1 className="text-5xl text-red-400 font-bold text-center">
            Hi, input your username of kick
          </h1>
          <div className="rounded-md bg-pt-black-100 p-4 w-[406px] max-w-full">
            <Formik
              initialValues={{ name: "" }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("This field is required"),
              })}
              onSubmit={async (values, actions) => {
                console.log(values);
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form className="text-black">
                  <Field
                    name="name"
                    component={TextInput}
                    placeholder="kick name"
                  />
                  <Button
                    type="submit"
                    className="w-full text-black mt-2"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? (
                      <div className="mx-auto w-fit">
                        <MetroSpinner color="#000000" size={25} />
                      </div>
                    ) : (
                      "continue verification"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      ) : (
        <div className="text-5xl text-red-400 font-bold text-center">
          <h1>Email verification failed</h1>
          <h1 className="mt-10">Please retry. :(</h1>
        </div>
      )}
    </div>
  );
}
