import { useContext } from "react";

import { NavContext } from "../../context/NavContext";

export default function MobileNav({ children, onClick, name }) {
  const { nav } = useContext(NavContext);

  return (
    <div
      className={`text-white hover:cursor-pointer hover-white-bottom-border p-3 hover:bg-pt-black-300 ${
        nav === name ? "active-mobilenav" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
