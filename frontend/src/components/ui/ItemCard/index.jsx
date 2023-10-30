import { useNavigate } from "react-router-dom";

import "./style.scss";
import constants from "../../../constants";
import { ProductDefault } from "../../../assets/images";
import Point from "../Point";

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const onClickCard = () => navigate(`/store/${item._id}`);
  return (
    <div
      className="rounded-md p-3 bg-pt-black-100 hover:bg-pt-black-400 cursor-pointer text-white flex flex-row gap-2 sm:flex-col items-center sm:items-stretch"
      onClick={() => onClickCard()}
    >
      <div className="max-w-[45%] sm:max-w-full">
        <img
          src={
            item.image ? `${constants.ITEM_DIR}/${item.image}` : ProductDefault
          }
          alt="item"
          className="w-full rounded-md"
        />
      </div>
      <div className="bg-pt-black-300 w-full h-[2px] rounded-full hidden sm:block"></div>
      <div className="bg-pt-black-300 h-full w-[2px] rounded-full sm:hidden"></div>
      <div className="flex flex-col justify-between flex-1 h-full">
        <div>
          <h1 className="font-bold mt-4">{item.name}</h1>
          <Point val={item.cost} />
        </div>
      </div>
    </div>
  );
}
