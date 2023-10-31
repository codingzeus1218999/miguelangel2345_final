export default function ButtonPink({ className, onClick, children }) {
  return (
    <button
      className={`${className} bg-pt-pink-200 text-xs rounded-md text-white hover:bg-pt-pink-100 p-1`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
