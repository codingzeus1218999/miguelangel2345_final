import { createContext, useState } from "react";

const initialState = {
  modal: "",
  setModal: () => {},
};

export const ModalContext = createContext(initialState);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState("");

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {children}
    </ModalContext.Provider>
  );
};
