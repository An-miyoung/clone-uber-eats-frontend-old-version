import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import RESTAURANT_FRAGMENTS from "../../fragments";
import { CATEGORY_FRAGMENTS } from "../../new-fragments";
import { category, categoryVariables } from "../../__generated__/category";

interface ICategoryProps {
  slug: string;
}

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
  ${CATEGORY_FRAGMENTS}
`;

const Category: React.FC = () => {
  const params = useParams<ICategoryProps>();
  const { slug } = params;

  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug,
        },
      },
    }
  );
  console.log(data);
  return <div>{slug}</div>;
};

export default Category;
