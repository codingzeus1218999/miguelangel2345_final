import { useState } from "react";

export default function Dropdown({ children, menu }) {
  const [overTitle, setOverTitle] = useState(false);
  const [overMenu, setOverMenu] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseOver={() => setOverTitle(true)}
        onMouseLeave={() => setOverTitle(false)}
      >
        {children}
      </div>
      <ul
        className={`absolute right-0 w-40 py-2 rounded-md bg-pt-black-100 cursor-pointer border border-pt-black-300 shadow-xl ${
          overTitle || overMenu ? "block" : "hidden"
        }`}
        onMouseOver={() => setOverMenu(true)}
        onMouseLeave={() => setOverMenu(false)}
      >
        {menu.map((item, idx) => (
          <li
            key={idx}
            className="w-full px-3 py-2 hover:bg-pt-black-200 rounded-sm text-white"
            onClick={() => item.onClick()}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
