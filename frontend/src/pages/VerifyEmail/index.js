import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import Button from "../../components/ui/Button";

import { getKickInfoByName, verifiedTwoStep, verifyEmailApi } from "../../apis";
import { NotificationManager } from "react-notifications";
import { Field, Form, Formik } from "formik";
import TextInput from "../../components/ui/TextInput";
import { MetroSpinner } from "react-spinners-kit";
import { generateVerificationRandomCode } from "../../utils";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [verificationRandomCode, setVerificationRandomCode] = useState("");
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
    setVerificationRandomCode(generateVerificationRandomCode());
  }, [token]);
  return (
    <div className="flex flex-col justify-center items-center mt-32 gap-10">
      {email ? (
        <>
          <div className="text-xl text-gray-400 text-center">
            <p>
              Paste the folowwing code somewhere in bio field of kick site and
              save.
            </p>
            <br />
            <p className="underline">{verificationRandomCode}</p>
            <br />
            <p>Input your username of kick site and click the below button.</p>
            <p>Please remove this code from your bio later. :)</p>
          </div>
          <div className="rounded-md bg-pt-black-100 p-4 w-[406px] max-w-full">
            <Formik
              initialValues={{ name: "" }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("This field is required"),
              })}
              onSubmit={async (values, actions) => {
                try {
                  const kickUser = await getKickInfoByName(values.name);
                  if (kickUser?.user?.username === values.name) {
                    if (kickUser?.user?.bio.includes(verificationRandomCode)) {
                      try {
                        const res = await verifiedTwoStep({
                          name: values.name,
                          token,
                        });
                        if (res.success) {
                          localStorage.setItem("token", res.data.token);
                          NotificationManager.success(res.message);
                          navigate("/");
                        } else {
                          NotificationManager.error(res.message);
                        }
                      } catch (err) {
                        console.log(err);
                        NotificationManager.error(
                          "Two step verification failed"
                        );
                      }
                    } else {
                      NotificationManager.error(
                        "Verification of your kick name is failed"
                      );
                    }
                  } else {
                    NotificationManager.error(
                      "There is no user with this kick name"
                    );
                  }
                } catch (err) {
                  console.log(err);
                  NotificationManager.error(
                    "Something went wrong in connecting with kick.com"
                  );
                }
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
