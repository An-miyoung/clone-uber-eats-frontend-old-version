import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";

interface IDishOptionProps {
  isSelected?: boolean;
  dishId: number;
  name: string;
  extra?: number | null;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  dishId,
  name,
  extra,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const optionClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };
  return (
    <div
      onClick={optionClick}
      className="flex items-end justify-between pr-5 border-b-2 border-gray-300"
    >
      <h6>{name}</h6>
      <h6 className=" text-sm font-light">
        {extra ? `${extra}원 추가` : "추가비용없음"}
      </h6>
      {isSelected ? (
        <span>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-sm font-light text-lime-500"
          />
        </span>
      ) : (
        <span>
          <FontAwesomeIcon
            icon={faCircle}
            className="text-sm font-light text-gray-300"
          />
        </span>
      )}
    </div>
  );
};

export default DishOption;
