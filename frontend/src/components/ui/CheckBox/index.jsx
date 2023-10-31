import { useState } from "react";

import {
  IconCheckboxBox,
  IconCheckboxChecked,
  IconCheckboxError,
} from "../../../assets/images";

export default function CheckBox({ field, form, ...props }) {
  const [isTouched, setIsTouched] = useState(false);

  const { name, value } = field;
  const { touched, errors, setFieldValue } = form;
  const { title, className } = props;

  const hasError = (touched[name] || isTouched) && errors[name];
  const onClick = () => {
    setFieldValue(name, !value);
    setIsTouched(true);
  };

  return (
    <div
      className={`${className} text-white flex flex-row items-center gap-2 cursor-pointer`}
      onClick={() => onClick()}
    >
      <img
        alt="checkbox"
        src={
          hasError
            ? IconCheckboxError
            : value
            ? IconCheckboxChecked
            : IconCheckboxBox
        }
      />
      <p>{title}</p>
      <input type="checkbox" {...field} className="hidden" />
    </div>
  );
}
