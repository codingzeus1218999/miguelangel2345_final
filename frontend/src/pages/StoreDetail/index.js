import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import Layout from "../../components/layout";
import ButtonPink from "../../components/ui/ButtonPink";
import Button from "../../components/ui/Button";
import Point from "../../components/ui/Point";
import PrizeCard from "../../components/form/PrizeCard";

import DefaultItemImage from "../../assets/images/money.jfif";
import BackImage from "../../assets/images/back.svg";
// import LockImage from "../..//assets/images/mod_item_locked.svg";

import { NavContext } from "../../context/NavContext";
import { UserContext } from "../../context/UserContext";
import { ModalContext } from "../../context/ModalContext";
import { getLatestPrizes, getPrizeInfoById } from "../../utils/api";
import { commafy } from "../../utils/numberUtils";
import constants from "../../constants";

export default function News() {
  const { setNav } = useContext(NavContext);
  const { isAuthenticated } = useContext(UserContext);
  const { modal, setModal } = useContext(ModalContext);
  const { id } = useParams();
  const [prize, setPrize] = useState({});
  const [latestPrizes, setLatestPrizes] = useState([]);
  const navigate = useNavigate();
  const fetchLatestPrizes = async () => {
    try {
      const res = await getLatestPrizes();
      setLatestPrizes(res.prizes);
    } catch (err) {
      NotificationManager.error(
        "Something was wrong in connection with server"
      );
    }
  };
  useEffect(() => {
    const fetchPrize = async () => {
      try {
        const res = await getPrizeInfoById(id);
        setPrize(res.prize);
      } catch (err) {
        NotificationManager.error(
          "Something was wrong in connection with server"
        );
      }
    };
    setNav("store");
    fetchPrize();
    fetchLatestPrizes();
  }, [id, setNav]);
  return (
    <Layout>
      <div className="sm:px-16">
        <span
          className="cursor-pointer block mb-6 text-white font-bold sm:hidden"
          onClick={() => navigate("/store")}
        >
          <img alt="back" src={BackImage} className="inline-block" />
          Store
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 bg-pt-black-100 rounded-md">
            <img
              src={
                prize.image
                  ? `${constants.PRIZE_DIR}/${prize.image}`
                  : DefaultItemImage
              }
              alt="Prize"
              className="mx-auto"
              width={650}
            />
          </div>
          <div className="text-white">
            <h1 className=" font-bold text-xl">{prize.name}</h1>
            <Point val={prize.points} />
            {/* {prize.shouldModerator && (
              <div className="mt-6 rounded-md p-3 bg-pt-black-100">
                <div className="flex flex-row gap-2">
                  <h1 className="text-sm font-bold">
                    Moderator Exclusive Item
                  </h1>
                  <img src={LockImage} className="inline" />
                </div>
                <h1 className="text-xs text-pt-black-600 mt-3">
                  This item is exclusive to our moderators. One of our ways of
                  saying thank you &lt;3
                </h1>
              </div>
            )} */}
            <p className="mt-6">{prize.description}</p>
            {prize.isLocked && (
              <div className="p-2 mt-6 bg-black border border-pt-black-500 rounded-md w-full">
                <h1 className="font-semibold text-sm">Locked</h1>
                <div className="bg-pt-black-600 rounded-lg w-full h-1 my-1">
                  <div
                    className="bg-pt-yellow-100 rounded-lg h-1"
                    style={{
                      width: `${(prize.wagerMin / prize.wagerMax) * 100}%`,
                    }}
                  ></div>
                </div>
                <h1 className="text-xs text-pt-black-500">{`${
                  prize.wagerMethod
                } Wager: $${commafy(prize.wagerMin)} / $${commafy(
                  prize.wagerMax
                )}`}</h1>
              </div>
            )}
            {isAuthenticated ? (
              prize.isLocked ? (
                <Button className="text-black mt-6 w-full" disabled={true}>
                  Connect to stake.com
                </Button>
              ) : (
                <Button className="text-black mt-6 w-full">Buy ticket</Button>
              )
            ) : (
              <Button
                className="text-black mt-6 w-full"
                onClick={() => setModal("login")}
              >
                Log in to buy
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="flex flex-row justify-between items-center mt-4">
          <h1 className="text-white">You Might Also Like</h1>
          <ButtonPink onClick={() => navigate("/store")}>See All</ButtonPink>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-4">
          {latestPrizes.map(
            (p) =>
              p._id !== prize._id && (
                <PrizeCard
                  key={p._id}
                  id={p._id}
                  img={
                    p.image
                      ? `${constants.PRIZE_DIR}/${p.image}`
                      : DefaultItemImage
                  }
                  title={p.name}
                  points={p.points}
                  isLocked={p.isLocked}
                  wagerState={p.wagerMethod}
                  min={p.wagerMin}
                  max={p.wagerMax}
                />
              )
          )}
        </div>
      </div>
    </Layout>
  );
}
