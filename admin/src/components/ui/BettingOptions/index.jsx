import { useEffect, useState } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMultiply } from "@fortawesome/free-solid-svg-icons";

export default function BettingOptions({ field, form, ...props }) {
  const { name, value } = field;
  const { setFieldValue } = form;
  const { placeholder, className, title, readOnly } = props;

  const [options, setOptions] = useState(value);

  const onClickAdd = () => {
    setOptions([...options, { case: "", command: "!bet" }]);
  };
  const onClickRemove = (i) => {
    const temp = options.filter((_, idx) => idx !== i);
    setOptions(temp);
  };
  const onChangeOption = (v, t, i) => {
    const temp = [...options];
    temp[i][[t]] = v;
    setOptions(temp);
  };

  useEffect(() => {
    setFieldValue(name, options);
  }, [options]);

  return (
    <div className={`pt-betting-options ${className}`}>
      <p className="placeholder">{placeholder}</p>
      <div className="flex mt-5 gap-3 flex-col">
        {value.map((r, idx) => (
          <div key={idx} className="flex flex-row gap-3 items-center">
            {!readOnly && (
              <FontAwesomeIcon
                icon={faMultiply}
                className="cursor-pointer"
                onClick={() => onClickRemove(idx)}
              />
            )}
            <input
              className="input-field"
              placeholder="option"
              type="text"
              value={r.case}
              readOnly={readOnly}
              onChange={({ target }) =>
                onChangeOption(target.value, "case", idx)
              }
            />
            <input
              className="input-field"
              placeholder="command"
              type="text"
              value={r.command}
              readOnly={readOnly}
              onChange={({ target }) =>
                onChangeOption(target.value, "command", idx)
              }
            />
          </div>
        ))}
      </div>
      {!readOnly && (
        <div
          className="mt-5 flex flex-row justify-center gap-3 w-fit mx-auto items-center cursor-pointer"
          onClick={() => onClickAdd()}
        >
          <FontAwesomeIcon icon={faAdd} />
          <h1 className="uppercase font-semibold">{title}</h1>
        </div>
      )}
    </div>
  );
}
