export default function TextInput({ field, form, ...props }) {
  const { name } = field;
  const { touched, errors } = form;
  const { placeholder, className, readOnly } = props;

  const hasError = touched[name] && errors[name];

  return (
    <div
      className={`input-container ${hasError ? "has-error" : ""} ${className}`}
    >
      <p>
        {placeholder}
        {hasError ? ` - ${errors[name]}` : ""}
      </p>
      <input
        type="text"
        {...field}
        readOnly={readOnly}
        className={`${readOnly && "cursor-not-allowed"}`}
      />
    </div>
  );
}
