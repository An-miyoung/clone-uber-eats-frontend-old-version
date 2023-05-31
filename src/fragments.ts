import { gql } from "@apollo/client";

const RESTAURANT_FRAGMENTS = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`;

export default RESTAURANT_FRAGMENTS;
