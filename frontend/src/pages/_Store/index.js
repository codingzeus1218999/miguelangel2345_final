import { useState, useContext, useEffect } from "react";
import { NotificationManager } from "react-notifications";

import Layout from "../../components/layout";
import { Button, Point } from "../../components/ui";
import PrizeCard from "../../components/form/PrizeCard";
import StoreInfoModal from "../../components/form/StoreInfoModal";

import { ProductDefault, IconInfo, Merch } from "../../assets/images";

import { NavContext } from "../../context/NavContext";
import { ModalContext } from "../../context/ModalContext";
import { getPrizes } from "../../apis";
import constants from "../../constants";

export default function Store() {
  const { setNav } = useContext(NavContext);
  const { setModal } = useContext(ModalContext);
  const [prizes, setPrizes] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getPrizes();
      setPrizes(res.prizes);
    } catch (err) {
      NotificationManager.error(
        "Something was wrong on connection with server"
      );
    }
  };

  useEffect(() => {
    setNav("store");
    fetchData();
  }, [setNav]);

  return (
    <Layout>
      <div className="flex flex-row justify-between items-center">
        <h1 className="page-title">Points Store</h1>
        <img
          alt="info"
          src={IconInfo}
          className="cursor-pointer"
          onClick={() => {
            setModal("storeInfo");
          }}
        />
      </div>
      <div className="mt-6 rounded-md p-3 bg-pt-black-100 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">Not Connected!</h1>
          <h1 className="text-white">
            Some items require you to wager on Stake.com to unlock them.
          </h1>
        </div>
        <Button>Connect to stake.com</Button>
      </div>
      <div className="mt-6 grid sm:grid-cols-4 gap-4 grid-cols-1">
        {prizes.map((p) => (
          <PrizeCard
            key={p._id}
            id={p._id}
            img={p.image ? `${constants.PRIZE_DIR}/${p.image}` : ProductDefault}
            title={p.name}
            points={p.points}
            isLocked={p.isLocked}
            wagerState={p.wagerMethod}
            min={p.wagerMin}
            max={p.wagerMax}
          />
        ))}
      </div>
      <div className="mt-6 flex flex-col-reverse gap-4 md:grid md:grid-cols-4 text-white">
        <div className="bg-pt-black-100 rounded-md p-3 md:col-span-3">
          <h1 className="font-bold">How to get points</h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mt-2">
            <div className="rounded-md bg-pt-black-300 p-2 md:col-span-5 flex items-center justify-between flex-wrap">
              <h1>Subscribe on Kick</h1>
              <Point val={100} />
            </div>
            <div className="rounded-md bg-pt-black-300 p-2 md:col-span-7 flex items-center justify-between flex-wrap">
              <h1>Every 30 mins of stream watched for Followers</h1>
              <Point val={15} />
            </div>
            <div className="rounded-md bg-pt-black-300 p-2 md:col-span-5 flex items-center justify-between flex-wrap">
              <h1>Witness a Big Win</h1>
              <Point val="5 / 15 / 30 / 60" />
            </div>
            <div className="rounded-md bg-pt-black-300 p-2 md:col-span-7 flex items-center justify-between flex-wrap">
              <h1>Every 30 mins of stream watched for Subscribes</h1>
              <Point val={30} />
            </div>
            <div className="rounded-md bg-pt-black-300 p-2 md:col-span-5 flex items-center justify-between flex-wrap">
              Join and Win bets on stream
            </div>
          </div>
          <Button className="text-black mt-4">Watch the stream</Button>
        </div>
        <div className="bg-pt-black-100 rounded-md p-3 z-0">
          <div className="relative md:h-full md:flex md:justify-between md:flex-col">
            <h1 className="text-4xl font-semibold relative">
              Looking for <br /> Merch?
            </h1>
            <Button className="text-black mt-4 w-full relative">
              See the merch store
            </Button>
            <img
              src={Merch}
              className="absolute right-0 bottom-2 -z-10"
              alt="merch"
            />
          </div>
        </div>
      </div>
      <StoreInfoModal />
    </Layout>
  );
}
