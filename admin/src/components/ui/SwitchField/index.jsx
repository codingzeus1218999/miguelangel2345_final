import Switch from "react-switch";

export default function SwitchField({ field, form, ...props }) {
  const { name, value } = field;
  const { setFieldValue } = form;
  const { placeholder, className } = props;

  return (
    <div className={`${className} flex flex-row gap-6 items-center`}>
      <span className="text-white font-bold tex-lg uppercase">
        {placeholder}
      </span>
      <Switch checked={value} onChange={(v) => setFieldValue(name, v)} />
    </div>
  );
}
