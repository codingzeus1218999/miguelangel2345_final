import "./style.scss";

export default function Check({ field, form, ...props }) {
  const { name, value } = field;
  const { touched, errors } = form;
  const { title, className } = props;

  const hasError = touched[name] && errors[name];

  return (
    <div
      className={`pt-check-container ${
        hasError ? "has-error" : ""
      } ${className}`}
    >
      <input type="checkbox" {...field} checked={value} />
      <label>{title}</label>
    </div>
  );
}
