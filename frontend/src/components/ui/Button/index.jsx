export default function Button({
  className,
  onClick,
  type = "button",
  disabled = false,
  children,
}) {
  return (
    <button
      className={`${className} bg-pt-yellow-100 py-2 px-4 text-4 uppercase font-bold rounded-md ${
        disabled ? "disabled-button" : ""
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
