import React from "react";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <div className="felx flex-col">
      <div
        className="py-20 bg-cover mb-3"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <h3 className="text-lg font-medium mb-1">{name}</h3>
      <span className="border-t-2 mt-1 py-1 border-gray-500 text-sm font-medium opacity-50">
        {categoryName}
      </span>
    </div>
  );
};

export default Restaurant;
