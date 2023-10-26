import { createContext, useState } from "react";

const initialState = {
  isAuthenticated: null,
  setIsAuthenticated: () => {},
  account: {},
  setAccount: () => {},
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState({});

  return (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, account, setAccount }}
    >
      {children}
    </UserContext.Provider>
  );
};
