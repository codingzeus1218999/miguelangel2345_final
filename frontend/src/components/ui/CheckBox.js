import { useState } from "react";

import CheckboxImage from "../../assets/images/checkbox.svg";
import CheckedImage from "../../assets/images/checkbox_checked.svg";
import CheckboxErrorImage from "../../assets/images/checkbox_error.svg";

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
          hasError ? CheckboxErrorImage : value ? CheckedImage : CheckboxImage
        }
      />
      <p>{title}</p>
      <input type="checkbox" {...field} className="hidden" />
    </div>
  );
}
