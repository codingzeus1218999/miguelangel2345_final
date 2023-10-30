export default function NumberInput({ field, form, ...props }) {
  const { name } = field;
  const { touched, errors } = form;
  const { placeholder, className, readOnly, min = 0 } = props;

  const hasError = !readOnly && touched[name] && errors[name];

  return (
    <div
      className={`input-container ${hasError ? "has-error" : ""} ${className}`}
    >
      <p>
        {placeholder}
        {hasError ? ` - ${errors[name]}` : ""}
      </p>
      <input
        type="number"
        {...field}
        readOnly={readOnly}
        min={min}
        className={`${readOnly && "cursor-not-allowed"}`}
      />
    </div>
  );
}
