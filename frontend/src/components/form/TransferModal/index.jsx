import { useContext } from "react";
import ReactModal from "react-modal";
import { NotificationManager } from "react-notifications";

import { ModalContext } from "../../../context/ModalContext";
import { Button } from "../../ui";
import { UserContext } from "../../../context/UserContext";
import "./style.scss";
import { transferPointsFromTwitch } from "../../../apis";
import { commafy } from "../../../utils";
import constants from "../../../constants";

ReactModal.setAppElement("#root");

export default function TransferModal({
  twitchInfo,
  streamInfo,
  afterSuccess,
}) {
  const { modal, setModal } = useContext(ModalContext);
  const { account, setAccount } = useContext(UserContext);

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

  const onClickTransfer = async () => {
    try {
      const res = await transferPointsFromTwitch({
        userId: account._id,
        streamInfo,
        twitchInfo,
        rate: constants.TWTICH_TRANSFER_RATE,
      });
      if (res.success) {
        setAccount(res.data.newUser);
        afterSuccess(res.data.newUser.points);
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

  return twitchInfo && streamInfo ? (
    <ReactModal
      isOpen={modal === "transfer"}
      style={customStyles}
      onRequestClose={() => setModal("")}
    >
      <p className="text-center font-bold text-2xl">Hi, {twitchInfo.login}</p>
      <p className="mt-6 text-center">
        You have {commafy(streamInfo.points)} points to your twitch account
      </p>
      {streamInfo.points > 0 && (
        <>
          <p className="mt-3 text-center">
            Are you sure that transfer these points to our store?
          </p>
          <p className="mt-3 text-center">
            You will get {commafy(streamInfo.points)} *{" "}
            {constants.TWTICH_TRANSFER_RATE} ={" "}
            {commafy(streamInfo.points * constants.TWTICH_TRANSFER_RATE)} points
          </p>
          <div className="flex justify-center">
            <Button className="text-black mt-6" onClick={onClickTransfer}>
              Transfer
            </Button>
          </div>
        </>
      )}
    </ReactModal>
  ) : (
    <></>
  );
}
