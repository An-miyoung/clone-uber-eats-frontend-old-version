import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishProps {
  isSelected?: boolean;
  id?: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  children?: any;
}

const Dish: React.FC<IDishProps> = ({
  isSelected,
  id = 0,
  name,
  price,
  photo,
  description,
  isCustomer = false,
  options,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`pl-4 pr-1 pt-4 pb-3 border-2 border-gray-300 transition-all cursor-pointer  ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className=" text-lg font-medium mb-3">{name}</h4>
          <h6 className=" font-light break-words mb-5">{description}</h6>
        </div>
        <div>
          {photo !== null && (
            <div
              className="p-12 bg-center bg-cover"
              style={{
                backgroundImage: `url(${photo})`,
              }}
            ></div>
          )}
        </div>
      </div>
      <div className="flex justify-between pr-5">
        <h4 className=" font-medium">{price}원</h4>
        {isCustomer && orderStarted && (
          <button
            onClick={onClick}
            className={`font-light text-sm text-white p-1 cursor-pointer ${
              isSelected ? "bg-red-500" : "bg-lime-600"
            }`}
          >
            {isSelected ? "주문취소" : "주문하기"}
          </button>
        )}
      </div>
      {isCustomer && options?.length !== 0 && orderStarted && (
        <div className=" mt-2">{dishOptions}</div>
      )}
    </div>
  );
};

export default Dish;
