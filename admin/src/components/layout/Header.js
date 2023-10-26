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
import { getUserInfoFromEmail } from "../../utils/api";
import constants from "../../constants";

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
            <Nav onClick={() => onClickNav("users")} name="users">
              Users
            </Nav>
            <Nav onClick={() => onClickNav("prizes")} name="prizes">
              Prizes
            </Nav>
            <Nav
              onClick={() => onClickNav("chatbot-settings")}
              name="chatbot-settings"
            >
              Chatbot Settings
            </Nav>
            <Nav
              onClick={() => onClickNav("chatbot-history")}
              name="chatbot-history"
            >
              Chatbot History
            </Nav>
            <Nav
              onClick={() => onClickNav("chatbot-realtime")}
              name="chatbot-realtime"
            >
              Chatbot Realtime
            </Nav>
            <Nav onClick={() => onClickNav("raffle")} name="raffle">
              Raffle
            </Nav>
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
        <MobileNav onClick={() => onClickNav("users")} name="users">
          Users
        </MobileNav>
        <MobileNav onClick={() => onClickNav("prizes")} name="prizes">
          Prizes
        </MobileNav>
        <MobileNav onClick={() => onClickNav("commands")} name="commands">
          Commands
        </MobileNav>
      </div>
    </header>
  );
}
