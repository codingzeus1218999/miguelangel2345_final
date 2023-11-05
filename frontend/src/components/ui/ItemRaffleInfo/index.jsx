import { useEffect, useContext, useState } from "react";
import moment from "moment";

import "./style.scss";
import { UserContext } from "../../../context/UserContext";

export default function ItemRaffleInfo({ raffles }) {
  const { account, isAuthenticated } = useContext(UserContext);
  const [thisCount, setThisCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);
  const [latestWinners, setLatestWinners] = useState([]);
  const [latestWinDate, setLatesWinDate] = useState(null);

  useEffect(() => {
    setPastCount(0);
    setThisCount(0);
    setLatesWinDate(null);
    setLatestWinners([]);
    if (isAuthenticated && raffles && raffles.length > 0) {
      raffles.map((raffle) => {
        if (raffle.state === "done") {
          raffle.participants.map((p) => {
            if (p.user._id === account._id)
              setPastCount((prev) => prev + p.count);
          });
          setLatestWinners(raffle.winners);
          setLatesWinDate(new Date(raffle.end_at));
        } else {
          raffle.participants.map((p) => {
            if (p.user._id === account._id) setThisCount(p.count);
          });
        }
      });
    }
  }, [raffles]);
  return isAuthenticated ? (
    <div className="pt-item-raffle-info">
      <h1 className="pt-label">My Tickets</h1>
      <div className="pt-info-panel mt-1">
        <h1>This raffle</h1>
        <h1>{thisCount}</h1>
      </div>
      <div className="pt-info-panel mt-1">
        <h1>Past raffle</h1>
        <h1>{pastCount}</h1>
      </div>
      <h1 className="pt-label mt-3">
        Latest wins{" "}
        {latestWinDate && `(${moment(latestWinDate).format("MM/DD/YYYY")})`}
      </h1>
      <div className="mt-1 flex flex-col gap-1">
        {latestWinners.map((l, idx) => (
          <div key={idx} className="pt-info-panel">
            {l.name}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}
