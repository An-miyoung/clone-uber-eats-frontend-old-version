import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { Helmet } from "react-helmet-async";
import Restaurant from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import RESTAURANT_FRAGMENTS from "../../fragments";
import { CATEGORY_FRAGMENTS } from "../../new-fragments";

interface IFormProps {
  searchTerm: string;
}

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    retaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
  ${CATEGORY_FRAGMENTS}
`;

const Restaurants = () => {
  const [page, setPage] = useState(1);
  const history = useHistory();
  const { register, handleSubmit, getValues } = useForm<IFormProps>();

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

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
      // URL에 표시되지 않아 보안이 가능하지만, 사용자가 URL 을 공유할 수 없다.
      // state: {
      //   searchTerm,
      // },
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className=" bg-gray-800 w-full py-28 flex items-center justify-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          placeholder="식당을 검색히세요..."
          className="input w-3/4 md:w-3/12 rounded-md font-light text-sm border-0"
        />
      </form>
      {!loading && (
        <div className="container w-full px-5 mt-8">
          <div className="flex justify-around max-w-xs mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <div className="flex flex-col group items-center cursor-pointer">
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
              </Link>
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
