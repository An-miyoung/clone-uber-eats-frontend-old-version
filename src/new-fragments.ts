import { gql } from "@apollo/client";

export const CATEGORY_FRAGMENTS = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`;
