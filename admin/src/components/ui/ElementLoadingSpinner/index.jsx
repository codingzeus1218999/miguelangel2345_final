import "./style.scss";
import { FlapperSpinner } from "react-spinners-kit";

export default function ElementLoadingSpinner({
  color = "#ffffff",
  size = 25,
}) {
  return <FlapperSpinner color={color} size={size} />;
}
