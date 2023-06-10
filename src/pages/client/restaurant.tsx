import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import RESTAURANT_FRAGMENTS from "../../fragments";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";

interface IRestaurantParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
`;

const Restaurant = () => {
  const { id } = useParams<IRestaurantParams>();

  const { data, loading } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: parseInt(id),
        },
      },
    }
  );
  console.log(data);
  return (
    <div>
      <div
        className="bg-gray-800 bg-center bg-cover py-28"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-56 lg:w-1/3 py-4 pl-12 opacity-70">
          <h4 className="text-2xl lg:text-4xl mb-3">
            {data?.restaurant.restaurant?.name}
          </h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.name}`}>
            <h5 className=" text-gray-800 text-sm font-light">
              {data?.restaurant.restaurant?.category?.name}
            </h5>
          </Link>
          <h6 className=" text-gray-800 text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
