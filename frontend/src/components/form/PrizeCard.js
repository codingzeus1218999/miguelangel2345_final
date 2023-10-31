import { useNavigate } from "react-router-dom";

import { Point } from "../ui";
import { commafy } from "../../utils";
import { IconTick } from "../../assets/images";

export default function PrizeCard({
  id,
  img,
  title,
  points,
  isLocked,
  wagerState,
  min,
  max,
}) {
  const navigate = useNavigate();
  const onClick = () => navigate(`/store/${id}`);
  return (
    <div
      className="rounded-md p-3 bg-pt-black-100 hover:bg-pt-black-400 cursor-pointer text-white flex flex-row gap-2 sm:flex-col items-center sm:items-stretch"
      onClick={onClick}
    >
      <div className="max-w-[45%] sm:max-w-full">
        <img src={img} alt="Prize" className="w-full rounded-md" />
      </div>
      <div className="bg-pt-black-300 w-full h-[2px] rounded-full hidden sm:block"></div>
      <div className="bg-pt-black-300 h-full w-[2px] rounded-full sm:hidden"></div>
      <div className="flex flex-col justify-between flex-1 h-full">
        <div>
          <h1 className="font-bold mt-4">{title}</h1>
          <Point val={points} />
        </div>
        {isLocked ? (
          <div className="p-2 mt-2 bg-black border border-pt-black-500 rounded-md w-full">
            <h1 className="font-semibold text-sm">Locked</h1>
            <div className="bg-pt-black-600 rounded-lg w-full h-1 my-1">
              <div
                className="bg-pt-yellow-100 rounded-lg h-1"
                style={{ width: `${(min / max) * 100}%` }}
              ></div>
            </div>
            <h1 className="text-xs text-pt-black-500">{`${wagerState} Wager: $${commafy(
              min
            )} / $${commafy(max)}`}</h1>
          </div>
        ) : (
          <div className="flex flex-row sm:justify-end items-center gap-1">
            <img src={IconTick} width={16} height={16} alt="IconTick" />
            <span className="text-pt-black-500 text-sm">
              Item always unlocked
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
