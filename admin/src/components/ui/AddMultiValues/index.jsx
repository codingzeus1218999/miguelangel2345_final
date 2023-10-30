import { useEffect, useState } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMultiply } from "@fortawesome/free-solid-svg-icons";

export default function AddMultiValues({ field, form, ...props }) {
  const { name, value } = field;
  const { setFieldValue } = form;
  const { placeholder, className, title } = props;

  const [items, setItems] = useState(value);

  const onClickAdd = () => {
    setItems([...items, ""]);
  };
  const onClickRemove = (i) => {
    const temp = items.filter((_, idx) => idx !== i);
    setItems(temp);
  };
  const onChangeItem = (v, i) => {
    const temp = [...items];
    temp[i] = v;
    setItems(temp);
  };

  useEffect(() => {
    setFieldValue(name, items);
  }, [items]);

  return (
    <div className={`pt-multi-items ${className}`}>
      <p className="placeholder">{placeholder}</p>
      <div className="flex mt-5 gap-3 flex-col">
        {value.map((r, idx) => (
          <div key={idx} className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon
              icon={faMultiply}
              className="cursor-pointer"
              onClick={() => onClickRemove(idx)}
            />
            <input
              className="input-field"
              type="text"
              value={r}
              onChange={({ target }) => onChangeItem(target.value, idx)}
            />
          </div>
        ))}
      </div>
      <div
        className="mt-5 flex flex-row justify-center gap-3 w-fit mx-auto items-center cursor-pointer"
        onClick={() => onClickAdd()}
      >
        <FontAwesomeIcon icon={faAdd} />
        <h1 className="uppercase font-semibold">{title}</h1>
      </div>
    </div>
  );
}
