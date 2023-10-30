import "./style.scss";

export default function TypeRadio({ field, form, ...props }) {
  const { name, value } = field;
  const { setFieldValue } = form;
  const { placeholder, className, items, onClickItem } = props;

  const onClickRadio = (value) => {
    setFieldValue(name, value);
    onClickItem(value);
  };

  return (
    <div className={`pt-type-radio-container ${className}`}>
      <p className="placeholder">{placeholder}</p>
      <div className="flex mt-5 gap-6 flex-col md:flex-row">
        {items.map((i, idx) => (
          <div className="item" key={idx} onClick={() => onClickRadio(i.value)}>
            <div
              className={`${i.value === value ? "active" : "inactive"} status`}
            ></div>
            <p>{i.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
