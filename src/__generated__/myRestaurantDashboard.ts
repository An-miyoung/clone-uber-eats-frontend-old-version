/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurantDashboard
// ====================================================

export interface myRestaurantDashboard_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurantDashboard_myRestaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface myRestaurantDashboard_myRestaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: myRestaurantDashboard_myRestaurant_restaurant_menu_options_choices[] | null;
}

export interface myRestaurantDashboard_myRestaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: myRestaurantDashboard_myRestaurant_restaurant_menu_options[] | null;
}

export interface myRestaurantDashboard_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: myRestaurantDashboard_myRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: myRestaurantDashboard_myRestaurant_restaurant_menu[];
}

export interface myRestaurantDashboard_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurantDashboard_myRestaurant_restaurant | null;
}

export interface myRestaurantDashboard {
  myRestaurant: myRestaurantDashboard_myRestaurant;
}

export interface myRestaurantDashboardVariables {
  input: MyRestaurantInput;
}
