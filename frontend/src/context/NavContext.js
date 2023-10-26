import { createContext, useState } from "react";

const initialState = {
  nav: "",
  setNav: () => {},
};

export const NavContext = createContext(initialState);

export const NavProvider = ({ children }) => {
  const [nav, setNav] = useState("home");

  return (
    <NavContext.Provider value={{ nav, setNav }}>
      {children}
    </NavContext.Provider>
  );
};
