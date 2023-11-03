import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import Layout from "../../components/layout";
import {
  Button,
  ButtonPink,
  ElementLoadingSpinner,
  ItemCard,
  Point,
} from "../../components/ui";

import { ProductDefault, IconBack } from "../../assets/images";

import { NavContext } from "../../context/NavContext";
import { UserContext } from "../../context/UserContext";
import { ModalContext } from "../../context/ModalContext";
import {
  getLatestItems,
  getItemInfoById,
  getCurrentServerTime,
} from "../../apis";
import constants from "../../constants";
import { PurchaseModal } from "../../components/form";
import { differenceTimes } from "../../utils";

export default function News() {
  const { setNav } = useContext(NavContext);
  const { isAuthenticated, account } = useContext(UserContext);
  const { setModal } = useContext(ModalContext);
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [latestItems, setLatestItems] = useState([]);
  const [currentServerTime, setCurrentServerTime] = useState(0);
  const [userLatestTime, setUserLatestTime] = useState(0);
  const [globalLatestTime, setGlobalLatestTime] = useState(0);

  const navigate = useNavigate();

  const fetchLatestItems = async () => {
    try {
      const res = await getLatestItems();
      if (res.success) setLatestItems(res.data.items);
      else NotificationManager.error(res.message);
    } catch (err) {
      NotificationManager.error(
        "Something was wrong in connection with server"
      );
    }
  };
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemInfoById(id);
        if (res.success) {
          setItem(res.data.item);
        } else NotificationManager.error(res.message);
      } catch (err) {
        NotificationManager.error(
          "Something was wrong in connection with server"
        );
      }
    };
    const timeCheck = setInterval(async () => {
      try {
        const res = await getCurrentServerTime();
        if (res.success) setCurrentServerTime(res.data.time);
      } catch (err) {
        console.log(err);
        NotificationManager.error(
          "Something went wrong with server connection"
        );
      }
    }, 1000);
    setNav("store");
    fetchItem();
    fetchLatestItems();
    return () => {
      clearInterval(timeCheck);
    };
  }, [id, setNav]);

  useEffect(() => {
    if (Object.keys(item).length > 0) {
      setUserLatestTime(
        item.users
          .filter((u) => u.user.toString() === account._id)
          .map((u) => u.date)
          .sort((a, b) => new Date(b) - new Date(a))?.[0]
      );
      setGlobalLatestTime(
        item.users
          .map((u) => u.date)
          .sort((a, b) => new Date(b) - new Date(a))?.[0]
      );
    }
  }, [item]);
  return (
    <Layout>
      <div className="sm:px-16">
        <span
          className="cursor-pointer block mb-6 text-white font-bold sm:hidden"
          onClick={() => navigate("/store")}
        >
          <img alt="back" src={IconBack} className="inline-block" />
          Store
        </span>
        {Object.keys(item).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <img
                src={
                  item.image
                    ? `${constants.ITEM_DIR}/${item.image}`
                    : ProductDefault
                }
                alt="Item"
                className="mx-auto rounded-md"
                width={650}
              />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl">{item.name}</h1>
              <Point val={item.cost} className="mt-6" />
              <p className="mt-6">{item.description}</p>
              {item?.quantity > -1 && (
                <h1 className="mt-6 font-bold text-xl">
                  Quantity: {item.quantity}
                </h1>
              )}
              {item?.type === "key" && (
                <div className="mt-6 flex flex-col gap-3">
                  <h1 className="font-bold text-xl">Codes:</h1>
                  {item?.codes.map((c, idx) => (
                    <h1 key={idx}>{c}</h1>
                  ))}
                </div>
              )}
              {isAuthenticated ? (
                <Button
                  className="text-black mt-6 w-full"
                  onClick={() => setModal("purchase")}
                  disabled={
                    item?.quantity < -1 ||
                    item?.quantity === 0 ||
                    differenceTimes(currentServerTime, userLatestTime) <
                      item.coolDownUser ||
                    differenceTimes(currentServerTime, globalLatestTime) <
                      item.coolDownGlobal
                  }
                >
                  {["redeem", "key"].includes(item.type)
                    ? "redeem item"
                    : "Buy ticket"}
                </Button>
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
        ) : (
          <div className="flex flex-row justify-center items-center my-20">
            <ElementLoadingSpinner />
          </div>
        )}
      </div>
      {latestItems.length > 0 ? (
        <div className="hidden sm:block">
          <div className="flex flex-row justify-between items-center mt-4">
            <h1 className="text-white">You Might Also Like</h1>
            <ButtonPink onClick={() => navigate("/store")}>See All</ButtonPink>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-4">
            {latestItems
              .filter((i) => i._id !== item._id)
              .slice(0, 4)
              .map((p) => (
                <ItemCard key={p._id} item={p} />
              ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-center items-center my-20">
          <ElementLoadingSpinner />
        </div>
      )}
      <PurchaseModal item={item} afterSuccess={(v) => setItem(v)} />
    </Layout>
  );
}
