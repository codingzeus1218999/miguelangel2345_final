export default function SelectField({ field, form, ...props }) {
  const { name } = field;
  const { setFieldValue, touched, errors } = form;
  const { options, placeholder, className } = props;

  const hasError = touched[name] && errors[name];

  return (
    <div
      className={`${className} input-container ${
        hasError ? "has-error" : "placeholder:"
      }`}
    >
      <p>
        {placeholder}
        {hasError ? ` - ${errors[name]}` : ""}
      </p>
      <select
        {...field}
        onChange={({ target }) => setFieldValue(name, target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
