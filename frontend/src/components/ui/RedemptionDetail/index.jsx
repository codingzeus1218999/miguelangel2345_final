import "./style.scss";

export default function RedemptionDetail({ details }) {
  return (
    <div className="flex flex-col gap-1">
      {details &&
        Object.keys(details).length > 0 &&
        Object.keys(details).map((dk, idx) => (
          <div key={idx} className="pt-redemption-detail">
            {dk}: {details[[dk]]}
          </div>
        ))}
    </div>
  );
}
