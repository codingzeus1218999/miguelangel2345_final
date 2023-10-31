import { useNavigate } from "react-router-dom";

import {
  LogoKick,
  LogoDscrd,
  LogoYt,
  LogoFcb,
  LogoInsta,
  LogoTwttr,
} from "../../assets/images";

export default function Footer() {
  const navigate = useNavigate();

  const onClickNav = (nav) => {
    navigate(`/${nav}`);
  };

  return (
    <footer className="mt-auto text-white bg-pt-black-100">
      <div className="container py-6 mx-auto grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="sm:col-span-3">
          <div className="bg-pt-black-300 rounded-md p-3 w-full sm:w-fit flex flex-row gap-6 items-center justify-between sm:justify-start flex-wrap">
            <a
              href="https://kick.com/miguelangel2345"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LogoKick} alt="LogoKick" />
            </a>
            <a
              href="https://discord.com/invite/miguelangel2345"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LogoDscrd} alt="LogoDiscord" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCA4j6yzBIi5jNA_FClDjscw"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LogoYt} alt="LogoYouTube" />
            </a>
            <a
              href="https://www.facebook.com/miguelangel2345/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LogoFcb} alt="LogoFacebook" />
            </a>
            <a
              href="https://www.instagram.com/miguelangel2345official/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LogoInsta} alt="LogoInstagram" />
            </a>
            <a
              href="https://twitter.com/miguelangel2345"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LogoTwttr} alt="LogoTwitter" />
            </a>
          </div>
          <div className="hidden mt-6 sm:block  text-sm">
            <a
              href="https://www.begambleaware.org/"
              target="_blank"
              rel="noreferrer"
            >
              18+ BeGambleAware.org
            </a>
            <p>Miguelangel2345 &copy; 2023. All rights reserved.</p>
          </div>
        </div>
        <div>
          <p className="font-bold">Miguelangel2345</p>
          <p className="cursor-pointer" onClick={() => onClickNav("news")}>
            News
          </p>
          <p className="cursor-pointer" onClick={() => onClickNav("about-us")}>
            About Us
          </p>
          <p className="cursor-pointer">Live Support</p>
        </div>
        <div>
          <p className="font-bold">Legal Stuff</p>
          <p
            className="cursor-pointer"
            onClick={() => onClickNav("privacy-policy")}
          >
            Privacy
          </p>
          <p
            className="cursor-pointer"
            onClick={() => onClickNav("terms-and-conditions")}
          >
            Terms
          </p>
          <p
            className="cursor-pointer"
            onClick={() => onClickNav("cookie-policy")}
          >
            Cookie
          </p>
        </div>
        <hr className="sm:hidden" />
        <div className="sm:hidden text-sm">
          <a
            href="https://www.begambleaware.org/"
            target="_blank"
            rel="noreferrer"
          >
            18+ BeGambleAware.org
          </a>
          <p>Miguelangel2345 &copy; 2023. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
