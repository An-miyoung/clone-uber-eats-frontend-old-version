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

export const DISH_FRAGMENTS = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`;

export const ORDERS_FRAGMENTS = gql`
  fragment OrderParts on Order {
    id
    createdAt
    total
    status
  }
`;
