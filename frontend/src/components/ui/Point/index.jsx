import { IconPoint } from "../../../assets/images";
import { commafy } from "../../../utils";

export default function Point({ className, val }) {
  return (
    <div className={`${className} flex items-center flex-row gap-1`}>
      <img src={IconPoint} width={16} height={16} alt="star" />
      <span className="font-bold">{commafy(val)}</span>
    </div>
  );
}
