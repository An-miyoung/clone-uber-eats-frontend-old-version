import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { Helmet } from "react-helmet-async";
import Restaurant from "../../components/restaurant";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    retaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
          slug
        }
        address
        isPromoted
      }
    }
  }
`;

const Restaurants = () => {
  const [page, setPage] = useState(1);

  const onCompleted = () => {
    console.log(data);
  };

  // page 가 바뀌면 다시 query를 실행한다.
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
    onCompleted,
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div>
      <Helmet>
        <title>Restaurant | Nuber Eats</title>
      </Helmet>
      <form className=" bg-gray-800 w-full py-28 flex items-center justify-center">
        <input
          type="search"
          placeholder="식당을 검색히세요..."
          className="input w-3/4 md:w-3/12 rounded-md font-light text-sm border-0"
        />
      </form>
      {!loading && (
        <div className="container w-full px-5 lg:px-0 mt-8">
          <div className="flex justify-around max-w-xs mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className="flex flex-col group items-center cursor-pointer"
              >
                <div
                  className="w-14 h-14 bg-cover group-hover:bg-gray-300 rounded-full bg-transparent"
                  style={{
                    backgroundImage: `url(${category.coverImg})`,
                  }}
                ></div>
                <span className=" text-xs mt-1">
                  {category.name.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <div className="grid mt-10 gap-x-4 gap-y-7 md:grid-cols-3">
            {data?.retaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={`${restaurant.id}`}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.retaurants.totalPages}
            </span>
            {page !== data?.retaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
