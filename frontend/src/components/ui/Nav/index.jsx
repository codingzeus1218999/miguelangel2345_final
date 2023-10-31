import { useContext } from "react";

import { NavContext } from "../../../context/NavContext";

export default function Nav({ children, onClick, name }) {
  const { nav } = useContext(NavContext);

  return (
    <div
      className={`text-white hover:cursor-pointer hover-white-bottom-border p-3 ${
        nav === name ? "active-nav" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
