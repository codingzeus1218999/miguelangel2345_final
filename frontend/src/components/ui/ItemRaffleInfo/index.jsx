import { useContext } from "react";
import moment from "moment";

import "./style.scss";
import { UserContext } from "../../../context/UserContext";

export default function ItemRaffleInfo({ raffles }) {
  const { isAuthenticated } = useContext(UserContext);

  return isAuthenticated && Object.keys(raffles).length > 0 ? (
    <div className="pt-item-raffle-info">
      <h1 className="pt-label">My Tickets</h1>
      <div className="pt-info-panel mt-1">
        <h1>This raffle</h1>
        <h1>{raffles.thisCount}</h1>
      </div>
      <div className="pt-info-panel mt-1">
        <h1>Past raffle</h1>
        <h1>{raffles.pastCount}</h1>
      </div>
      <h1 className="pt-label mt-3">
        Latest wins{" "}
        {raffles.latestWinDate &&
          `(${moment(raffles.latestWinDate).format("MM/DD/YYYY")})`}
      </h1>
      <div className="mt-1 flex flex-col gap-1">
        {raffles.latestWinners.map((name, idx) => (
          <div key={idx} className="pt-info-panel">
            {name}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}
