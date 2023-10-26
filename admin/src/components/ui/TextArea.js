export default function TextArea({ field, form, ...props }) {
  const { name } = field;
  const { touched, errors } = form;
  const { placeholder, className, readOnly, rows } = props;

  const hasError = !readOnly && touched[name] && errors[name];

  return (
    <div
      className={`text-container input-container ${
        hasError ? "has-error" : ""
      } ${className}`}
    >
      <p>
        {placeholder}
        {hasError ? ` - ${errors[name]}` : ""}
      </p>
      <textarea
        {...field}
        rows={rows}
        readOnly={readOnly}
        className={`${readOnly && "cursor-not-allowed"}`}
      />
    </div>
  );
}
