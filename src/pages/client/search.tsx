import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import RESTAURANT_FRAGMENTS from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
`;

const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(1);

  // URL 에서 searchTerm 을 가져오는 동안 database 에 쿼리하지 못하도록 lazy query 를 쓴다.
  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const [_, query] = location.search.split("term=");
    if (query === undefined) {
      return history.replace("/");
    }

    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [history, location.search, page, queryReadyToStart]);
  console.log(loading, data, called);
  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
    </div>
  );
};

export default Search;
