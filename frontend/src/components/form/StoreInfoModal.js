import { useContext } from "react";
import ReactModal from "react-modal";

import CloseImage from "../../assets/images/close.svg";

import { ModalContext } from "../../context/ModalContext";

ReactModal.setAppElement("#root");

export default function StoreInfoModal() {
  const { modal, setModal } = useContext(ModalContext);

  const customStyles = {
    content: {
      maxWidth: "406px",
      width: "100%",
      height: "min-content",
      margin: "auto",
      padding: "18px",
      backgroundColor: "#424042",
      border: "none",
      color: "#ffffff",
      inset: "0px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <ReactModal
      isOpen={["storeInfo"].includes(modal)}
      style={customStyles}
      onRequestClose={() => setModal("")}
    >
      <div className="flex flex-col gap-2 text-center font-bold">
        <div>
          <img
            alt="close"
            src={CloseImage}
            onClick={() => setModal("")}
            className="cursor-pointer ml-auto"
          />
        </div>
        <h1>Wahtch the stream</h1>
        <h1>Earn Points</h1>
        <h1>Connect to stake.com</h1>
        <h1>Wager to unlock items</h1>
      </div>
    </ReactModal>
  );
}
