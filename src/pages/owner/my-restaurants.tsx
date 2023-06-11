import { gql, useQuery } from "@apollo/client";
import React from "react";
import RESTAURANT_FRAGMENTS from "../../fragments";
import { myRestaurants } from "../../__generated__/myRestaurants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Restaurant from "../../components/restaurant";

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

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container w-full px-7 mt-8">
        <h2 className=" text-3xl font-medium mb-10">나의 Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className=" text-xl mb-5">표시할 레스토랑이 없습니다.</h4>
            <Link to="/add-restaurant" className="link">
              레스토랑 만들기 &rarr;
            </Link>
          </>
        ) : (
          <div className="grid mt-10 gap-x-4 gap-y-7 md:grid-cols-3">
            {data?.myRestaurants.restaurants.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={`${restaurant.id}`}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRestaurants;
