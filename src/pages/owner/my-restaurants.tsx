import { gql, useQuery } from "@apollo/client";
import React from "react";
import RESTAURANT_FRAGMENTS from "../../fragments";
import { myRestaurants } from "../../__generated__/myRestaurants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
`;

const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  console.log(data);
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className=" text-3xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
          data.myRestaurants.restaurants.length === 0 && (
            <>
              <h4 className=" text-xl mb-5">표시할 레스토랑이 없습니다.</h4>
              <Link to="/add-restaurant" className="link">
                레스토랑 만들기 &rarr;
              </Link>
            </>
          )}
      </div>
    </div>
  );
};

export default MyRestaurants;
