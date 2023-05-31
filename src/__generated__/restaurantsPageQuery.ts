/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsPageQuery
// ====================================================

export interface restaurantsPageQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface restaurantsPageQuery_allCategories {
  __typename: "AllCategorieOutput";
  ok: boolean;
  error: string | null;
  categories: restaurantsPageQuery_allCategories_categories[] | null;
}

export interface restaurantsPageQuery_retaurants_results_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface restaurantsPageQuery_retaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantsPageQuery_retaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantsPageQuery_retaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: restaurantsPageQuery_retaurants_results[] | null;
}

export interface restaurantsPageQuery {
  allCategories: restaurantsPageQuery_allCategories;
  retaurants: restaurantsPageQuery_retaurants;
}

export interface restaurantsPageQueryVariables {
  input: RestaurantsInput;
}
