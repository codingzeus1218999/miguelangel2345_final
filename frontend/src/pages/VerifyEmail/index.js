import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImpulseSpinner } from "react-spinners-kit";

import Button from "../../components/ui/Button";

import { verifyEmailApi } from "../../utils/api";

export default function VerifyEmail() {
  const navigator = useNavigate();

  const { token } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    verifyEmailApi(
      token,
      (res) => {
        localStorage.setItem("token", res.data.token);
        setSuccess(true);
      },
      (err) => {
        setSuccess(false);
        err.response.data.success === false
          ? setErrMsg(err.response.data.message)
          : setErrMsg("Something is wrong.");
      }
    );
  }, [token]);
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigator("/");
      }, 2000);
    }
  }, [success, navigator]);
  return (
    <div className="flex flex-row justify-center items-center mt-32">
      <div className="text-center pt-box p-12 rounded-md">
        <h1 className="text-white font-extrabold text-4xl text-center">
          {success ? `Welcome to miguelangel2345` : `I'm so sorry`}
        </h1>
        {success && (
          <div className="mt-6 text-center mx-auto w-fit">
            <ImpulseSpinner />
          </div>
        )}
        <h1 className="text-white text-center mt-6">
          {success ? "Redirecting to homepage..." : errMsg}
        </h1>
        <Button className="mt-6" onClick={() => navigator("/")}>
          Return to homepage
        </Button>
      </div>
    </div>
  );
}
