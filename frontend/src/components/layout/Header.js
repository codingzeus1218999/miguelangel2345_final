import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { NotificationManager } from "react-notifications";
import Avatar from "react-avatar";

import Button from "../ui/Button";
import Nav from "../ui/Nav";
import MobileNav from "../ui/MobileNav";
import Dropdown from "../ui/Dropdown";
import Point from "../ui/Point";

import LogoImage from "../../assets/images/logo.svg";
import HamburgerImage from "../../assets/images/hamburger.svg";
import CloseImage from "../../assets/images/close.svg";
import DefaultAvatarImage from "../../assets/images/avatar.jpg";

import { ModalContext } from "../../context/ModalContext";
import { UserContext } from "../../context/UserContext";
import { getUserInfoFromEmail } from "../../utils/api";
import constants from "../../constants";

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
    <header className="bg-pt-black-100 sticky top-0">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <Nav onClick={() => onClickNav("")} name="home">
            <img src={LogoImage} alt="Logo" />
          </Nav>
          <div className="sm:flex flex-row gap-1 hidden items-center">
            <Nav onClick={() => onClickNav("casino-bonus")} name="casino-bonus">
              Casino Bonus
            </Nav>
            <Nav onClick={() => onClickNav("videos")} name="videos">
              Videos
            </Nav>
            <Nav onClick={() => onClickNav("stream")} name="stream">
              Stream
            </Nav>
            <Nav onClick={() => onClickNav("tournaments")} name="tournaments">
              Tournaments
            </Nav>
            <Nav onClick={() => onClickNav("store")} name="store">
              Store
            </Nav>
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
                    : DefaultAvatarImage
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
        <MobileNav
          onClick={() => onClickNav("casino-bonus")}
          name="casino-bonus"
        >
          Casino Bonus
        </MobileNav>
        <MobileNav onClick={() => onClickNav("videos")} name="videos">
          Videos
        </MobileNav>
        <MobileNav onClick={() => onClickNav("stream")} name="stream">
          Stream
        </MobileNav>
        <MobileNav onClick={() => onClickNav("tournaments")} name="tournaments">
          Tournaments
        </MobileNav>
        <MobileNav onClick={() => onClickNav("store")} name="store">
          Store
        </MobileNav>
      </div>
    </header>
  );
}
