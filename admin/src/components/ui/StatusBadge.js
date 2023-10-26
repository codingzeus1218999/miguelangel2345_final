export default function StatusBadge({ status, labels }) {
  return (
    <div
      className={`p-1 ${status ? "bg-green-500" : "bg-red-500"} rounded-full`}
    >
      {status ? labels[1] : labels[0]}
    </div>
  );
}
