import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { NotificationManager } from "react-notifications";
import Avatar from "react-avatar";

import Nav from "../ui/Nav";
import MobileNav from "../ui/MobileNav";
import Dropdown from "../ui/Dropdown";
import HamburgerImage from "../../assets/images/hamburger.svg";
import CloseImage from "../../assets/images/close.svg";
import DefaultAvatarImage from "../../assets/images/avatar.jpg";
import { UserContext } from "../../context/UserContext";
import { getUserInfoFromEmail } from "../../apis";
import constants from "../../constants";

const menu = [
  { link: "users", name: "users", title: "Users" },
  { link: "prizes", name: "prizes", title: "Prizes" },
  { link: "items", name: "items", title: "Items" },
  {
    link: "chatbot-settings",
    name: "chatbot-settings",
    title: "Chatbot Settings",
  },
  {
    link: "chatbot-history",
    name: "chatbot-history",
    title: "Chatbot History",
  },
  {
    link: "chatbot-realtime",
    name: "chatbot-realtime",
    title: "Chatbot Realtime",
  },
  { link: "raffle", name: "raffle", title: "Raffle" },
];

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, account, setIsAuthenticated, setAccount } =
    useContext(UserContext);

  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsAuthenticated(false);
      setAccount({});
      navigate("/");
    } else {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const expirationTime = decodedToken.exp;
      const currentTime = Date.now() / 1000;
      if (expirationTime < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setAccount({});
        navigate("/");
      } else {
        getUserInfoFromEmail(
          decodedToken.email,
          (res) => {
            setIsAuthenticated(true);
            setAccount(res.data.user);
          },
          (err) => {
            err.response.data.success === false
              ? NotificationManager.error(err.response.data.message)
              : NotificationManager.error(
                  "Something is wrong, please try again."
                );
          }
        );
      }
    }
  }, [navigate, setAccount, setIsAuthenticated]);

  const onClickNav = (nav) => {
    navigate(`/${nav}`);
  };
  const onClickHamburger = () => {
    setIsShowMobileMenu(!isShowMobileMenu);
  };
  const onClickLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAccount({});
    navigate("/");
  };

  return (
    <header className="bg-pt-black-100 sticky top-0">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <div className="sm:flex flex-row gap-1 hidden items-center">
            {menu.map((m, idx) => (
              <Nav key={idx} onClick={() => onClickNav(m.link)} name={m.name}>
                {m.title}
              </Nav>
            ))}
          </div>
        </div>
        {isAuthenticated && (
          <Dropdown
            menu={[{ title: "Log out", onClick: () => onClickLogout() }]}
          >
            <div className="cursor-pointer flex items-center gap-2">
              <Avatar
                src={
                  account.avatar
                    ? `${constants.AVATAR_DIR}/${account.avatar}`
                    : DefaultAvatarImage
                }
                round={true}
                size="40"
              />
              <span className="text-white font-bold">{account.name}</span>
            </div>
          </Dropdown>
        )}
        <img
          src={isShowMobileMenu ? CloseImage : HamburgerImage}
          alt="humberger"
          className="sm:hidden cursor-pointer"
          onClick={() => {
            onClickHamburger();
          }}
        />
      </div>
      <div
        className={`sm:hidden flex-col ${isShowMobileMenu ? "flex" : "hidden"}`}
      >
        {menu.map((m, idx) => (
          <MobileNav key={idx} onClick={() => onClickNav(m.link)} name={m.name}>
            {m.title}
          </MobileNav>
        ))}
      </div>
    </header>
  );
}
