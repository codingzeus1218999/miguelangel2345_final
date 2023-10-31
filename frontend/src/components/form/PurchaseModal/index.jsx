import { useContext, useEffect, useState } from "react";
import ReactModal from "react-modal";

import { ModalContext } from "../../../context/ModalContext";
import { ProductDefault } from "../../../assets/images";
import constants from "../../../constants";
import { Button, Point } from "../../ui";
import { UserContext } from "../../../context/UserContext";
import "./style.scss";
import { NotificationManager } from "react-notifications";
import { purchaseItem } from "../../../apis";

ReactModal.setAppElement("#root");

export default function PurchaseModal({ item, afterSuccess }) {
  const { modal, setModal } = useContext(ModalContext);
  const { account, setAccount } = useContext(UserContext);
  const [requirements, setRequirements] = useState({});

  const customStyles = {
    content: {
      maxWidth: "700px",
      width: "100%",
      height: "min-content",
      margin: "auto",
      padding: "18px",
      backgroundColor: "#2e2d2e",
      border: "none",
      color: "#ffffff",
      inset: "0px",
      fontSize: "20px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  useEffect(() => {
    if (item?.type === "redeem") {
      let temp = {};
      item?.requirements.map((r) => (temp[`${r}`] = ""));
      setRequirements(temp);
    }
  }, [item]);

  const onClickRedeem = async () => {
    try {
      const res = await purchaseItem({
        itemId: item._id,
        userId: account._id,
        requirements: JSON.stringify(requirements),
      });
      if (res.success) {
        setAccount(res.data.newUser);
        afterSuccess(res.data.newItem);
        NotificationManager.success(res.message);
        setModal("");
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

  const onChangeRequirement = (field, v) => {
    let temp = { ...requirements };
    temp[`${field}`] = v;
    setRequirements(temp);
  };

  return (
    <ReactModal
      isOpen={modal === "purchase"}
      style={customStyles}
      onRequestClose={() => setModal("")}
    >
      <div className="flex flex-col gap-10 pt-purchase-modal">
        <div className="flex flex-row gap-10 items-center">
          <div className="rounded-md bg-pt-black-300 p-1 w-[200px] min-w-[200px]">
            <img
              src={
                item.image
                  ? `${constants.ITEM_DIR}/${item.image}`
                  : ProductDefault
              }
              alt="Item"
              className="w-full"
            />
          </div>
          <h1 className="font-extrabold text-3xl">{item.name}</h1>
        </div>
        <div className="bg-pt-black-300 p-5 rounded-md flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <h1>My Current Balance</h1>
            <Point val={account.points} />
          </div>
          <div className="flex flex-row justify-between">
            <h1>Item Price</h1>
            <Point val={item.cost} />
          </div>
          <hr />
          <div className="flex flex-row justify-between">
            <h1>Balance After Purchase</h1>
            <Point val={account.points - item.cost} />
          </div>
        </div>
        {item?.type === "redeem" && item?.requirements.length > 0 && (
          <div className="bg-pt-black-300 p-5 rounded-md flex flex-col gap-5">
            {item?.requirements.map((r, idx) => (
              <input
                type="text"
                key={idx}
                placeholder={r}
                className="requirement"
                value={requirements?.[`${r}`]}
                onChange={({ target }) => onChangeRequirement(r, target.value)}
              />
            ))}
          </div>
        )}
        <Button
          className="text-black font-bold"
          onClick={() => onClickRedeem()}
          disabled={
            item.quantity < -1 ||
            item.quantity === 0 ||
            account.points - item.cost < 0 ||
            (Object.values(requirements).filter((r) => r.trim() === "").length >
              0 &&
              item.type === "redeem")
          }
        >
          Redeem
        </Button>
      </div>
    </ReactModal>
  );
}
