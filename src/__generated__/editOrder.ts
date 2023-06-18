/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditOrderInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editOrder
// ====================================================

export interface editOrder_editOrder_order_driver {
  __typename: "User";
  email: string;
}

export interface editOrder_editOrder_order_customer {
  __typename: "User";
  email: string;
}

export interface editOrder_editOrder_order_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface editOrder_editOrder_order {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: editOrder_editOrder_order_driver | null;
  customer: editOrder_editOrder_order_customer | null;
  restaurant: editOrder_editOrder_order_restaurant | null;
}

export interface editOrder_editOrder {
  __typename: "EditOrderOutput";
  ok: boolean;
  error: string | null;
  order: editOrder_editOrder_order | null;
}

export interface editOrder {
  editOrder: editOrder_editOrder;
}

export interface editOrderVariables {
  input: EditOrderInput;
}
