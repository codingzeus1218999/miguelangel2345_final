import { useState } from "react";

import VisibieOnImage from "../../assets/images/visibility_on.svg";
import VisibieOffImage from "../../assets/images/visibility_off.svg";
import verifiedImage from "../../assets/images/pass_state_ver.105e4416.svg";
import unverifiedImage from "../../assets/images/pass_state_not_ver.4dae1e58.svg";

export default function PasswordInput({ field, form, ...props }) {
  const [visible, setVisible] = useState(false);

  const { name, value } = field;
  const { touched, errors } = form;
  const { placeholder, className, checkDisplay } = props;

  const hasError = touched[name] && errors[name];

  return (
    <div
      className={`password-container input-container ${
        hasError ? "has-error" : ""
      } ${className}`}
    >
      <p>
        {placeholder}
        {hasError ? ` - ${errors[name]}` : ""}
      </p>
      <div className="flex justify-between items-center gap-2 mt-2">
        <input
          className="!mt-0"
          type={visible ? "text" : "password"}
          {...field}
        />
        <img
          src={visible ? VisibieOnImage : VisibieOffImage}
          className="cursor-pointer"
          onClick={() => {
            setVisible(!visible);
          }}
          alt="eye"
        />
      </div>
      {checkDisplay && (
        <div className="grid grid-cols-12 text-xs uppercase font-semibold bg-pt-black-100 rounded-md p-2">
          <div className="col-span-5">
            <img
              src={/[a-zA-Z]/.test(value) ? verifiedImage : unverifiedImage}
              className="inline"
              alt="dot"
            />
            &nbsp;1 letter
          </div>
          <div className="col-span-7">
            <img
              src={
                /^(?=.*[!@#$%^&*])/g.test(value)
                  ? verifiedImage
                  : unverifiedImage
              }
              className="inline"
              alt="dot"
            />
            &nbsp;1 special character
          </div>
          <div className="col-span-5">
            <img
              src={/^(?=.*\d)/.test(value) ? verifiedImage : unverifiedImage}
              className="inline"
              alt="dot"
            />
            &nbsp;1 number
          </div>
          <div className="col-span-7">
            <img
              src={value.length > 7 ? verifiedImage : unverifiedImage}
              className="inline"
              alt="dot"
            />
            &nbsp;8 characters minimum
          </div>
        </div>
      )}
    </div>
  );
}
