import React from "react";

interface IDishProps {
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
}

const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  photo,
  description,
}) => {
  return (
    <div className="pl-4 pr-1 pt-4 pb-1 border-2 border-gray-300 flex items-center justify-between">
      <div>
        <h4 className=" text-lg font-medium mb-3">{name}</h4>
        <h6 className=" font-light break-words mb-5">{description}</h6>
        <h4 className=" font-medium">{price}원</h4>
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
  );
};

export default Dish;
