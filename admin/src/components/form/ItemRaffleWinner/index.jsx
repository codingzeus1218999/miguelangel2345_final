import { useState } from "react";
import "./style.scss";
import { Button } from "../../ui";
import { NotificationManager } from "react-notifications";
import { chooseWinners } from "../../../apis";

export default function ItemRaffleWinner({ raffle, callback = () => {} }) {
  const [winners, setWinners] = useState([]);
  const onClickDone = async () => {
    try {
      const res = await chooseWinners({
        raffleId: raffle._id,
        winners,
      });
      if (res.success) {
        NotificationManager.success(res.message);
        callback();
      } else {
        NotificationManager.error(res.message);
      }
    } catch (err) {
      console.log(err);
      NotificationManager.error(
        "Something went wrong with connecting to server"
      );
    }
  };
  const onCheck = (id) => {
    let temp = [...winners];
    if (temp.includes(id)) {
      const idx = temp.findIndex((t) => t === id);
      temp.splice(idx, 1);
    } else {
      temp.push(id);
    }
    setWinners(temp);
  };
  return (
    <div className="pt-item-raffle-winner">
      {raffle && (
        <div className="flex flex-col gap-2">
          {raffle.participants.map((p, idx) => (
            <div key={idx}>
              <input type="checkbox" onChange={() => onCheck(p.user._id)} />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{p.user.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <strong>({p.count})</strong>
            </div>
          ))}
        </div>
      )}
      <Button
        className="mt-6 text-black"
        onClick={() => onClickDone()}
        disabled={winners.length === 0}
      >
        Done
      </Button>
    </div>
  );
}
