import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { NotificationManager } from "react-notifications";
import Avatar from "react-avatar";

import { Button, Nav, MobileNav, Dropdown, Point } from "../ui";

import {
  Logo,
  IconHamburger,
  IconClose,
  AvatarDefault,
} from "../../assets/images";

import { ModalContext } from "../../context/ModalContext";
import { UserContext } from "../../context/UserContext";
import { getUserInfoFromEmail } from "../../apis";
import constants from "../../constants";

const menu = [
  { link: "casino-bonus", name: "casino-bonus", title: "Casino Bonus" },
  { link: "videos", name: "videos", title: "Videos" },
  { link: "stream", name: "stream", title: "Stream" },
  { link: "tournaments", name: "tournaments", title: "Tournaments" },
  { link: "store", name: "store", title: "Store" },
];

export default function Header() {
  const navigate = useNavigate();
  const { setModal } = useContext(ModalContext);
  const { isAuthenticated, account, setIsAuthenticated, setAccount } =
    useContext(UserContext);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsAuthenticated(false);
      setAccount({});
    } else {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const expirationTime = decodedToken.exp;
      const currentTime = Date.now() / 1000;
      if (expirationTime < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setAccount({});
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
  }, [setAccount, setIsAuthenticated]);

  const onClickNav = (nav) => {
    navigate(`/${nav}`);
  };
  const onClickLogin = () => {
    setModal("login");
  };
  const onClickHamburger = () => {
    setIsShowMobileMenu(!isShowMobileMenu);
  };
  const onClickLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAccount({});
  };

  return (
    <header className="bg-pt-black-100 sticky top-0 z-50">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <Nav onClick={() => onClickNav("")} name="home">
            <img src={Logo} alt="Logo" />
          </Nav>
          <div className="sm:flex flex-row gap-1 hidden items-center">
            {menu.map((m, idx) => (
              <Nav key={idx} onClick={() => onClickNav(m.link)} name={m.name}>
                {m.title}
              </Nav>
            ))}
          </div>
        </div>
        {isAuthenticated ? (
          <Dropdown
            menu={[
              {
                title: "Profile",
                onClick: () => navigate("/profile"),
              },
              { title: "Log out", onClick: () => onClickLogout() },
            ]}
          >
            <div className="cursor-pointer flex items-center gap-2">
              <Avatar
                src={
                  account.avatar
                    ? `${constants.AVATAR_DIR}/${account.avatar}`
                    : AvatarDefault
                }
                round={true}
                size="40"
              />
              <span className="text-white font-bold">{account.name}</span>
              <Point val={account.points} className="text-white" />
            </div>
          </Dropdown>
        ) : (
          <Button onClick={onClickLogin}>Log in</Button>
        )}
        <img
          src={isShowMobileMenu ? IconClose : IconHamburger}
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
