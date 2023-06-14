import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import RESTAURANT_FRAGMENTS from "../../fragments";
import {
  myRestaurantDashboard,
  myRestaurantDashboardVariables,
} from "../../__generated__/myRestaurantDashboard";
import { DISH_FRAGMENTS } from "../../new-fragments";
import Dish from "../../components/dish";

interface IParams {
  id: string;
}

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurantDashboard($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
  ${DISH_FRAGMENTS}
`;

const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<
    myRestaurantDashboard,
    myRestaurantDashboardVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });

  console.log(data);
  return (
    <div>
      <div
        className=" bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container w-full px-7 mt-8">
        <h2 className=" text-3xl font-bold mb-6">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <div className="flex">
          <Link
            to={`/restaurant/${data?.myRestaurant.restaurant?.id}/add-dish`}
            className="mr-8 text-white bg-gray-800 py-3 px-10"
          >
            메뉴 만들기 &rarr;
          </Link>
          <Link
            to={``}
            className="cursor-pointer text-white bg-lime-700 py-3 px-10"
          >
            프로모션 구매하기 &rarr;
          </Link>
        </div>
        <div className="mt-8">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <span>메뉴가 없습니다. 메뉴를 추가해 주세요.</span>
          ) : (
            <div className="grid mt-10 gap-x-4 gap-y-7 md:grid-cols-3">
              {data?.myRestaurant.restaurant?.menu.map((menu) => (
                <Dish
                  key={menu.id}
                  id={menu.id}
                  name={menu.name}
                  price={menu.price}
                  photo={menu.photo}
                  description={menu.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
