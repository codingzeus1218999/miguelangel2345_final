import { useContext } from "react";
import ReactModal from "react-modal";

import { ModalContext } from "../../context/ModalContext";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotForm from "./ForgotForm";

ReactModal.setAppElement("#root");

export default function AuthModal() {
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
      isOpen={["login", "register", "forgot"].includes(modal)}
      style={customStyles}
      onRequestClose={() => setModal("")}
    >
      {modal === "login" ? (
        <LoginForm />
      ) : modal === "register" ? (
        <RegisterForm />
      ) : (
        <ForgotForm />
      )}
    </ReactModal>
  );
}
