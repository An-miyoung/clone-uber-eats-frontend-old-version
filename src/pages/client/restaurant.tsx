import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import RESTAURANT_FRAGMENTS from "../../fragments";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";
import { DISH_FRAGMENTS } from "../../new-fragments";
import { Helmet } from "react-helmet-async";
import Dish from "../../components/dish";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import DishOption from "../../components/dish-option";
import {
  createOrder,
  createOrderVariables,
} from "../../__generated__/createOrder";

interface IRestaurantParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
  ${DISH_FRAGMENTS}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

const Restaurant = () => {
  const { id } = useParams<IRestaurantParams>();
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const history = useHistory();

  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: parseInt(id),
      },
    },
  });

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((prev) => [{ dishId, options: [] }, ...prev]);
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((prev) => prev.filter((order) => order.dishId !== dishId));
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((old) => old.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((prev) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...prev,
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      const newOption = oldItem.options?.filter(
        (option) => option.name !== optionName
      );
      setOrderItems((prev) => [{ dishId, options: newOption }, ...prev]);
      return;
    }
  };

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;

    if (ok) {
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerConfirmOrder = () => {
    // 한개의 주문을 DB 에 보내는 동안 짧은 시차를 두고 2번째 주문을 mutation하지 못하게 한다.
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    const ok = window.confirm("주문을 확정하고 결제하시겠습니까?");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +id,
            items: orderItems,
          },
        },
      });
    }
    console.log(orderItems);
  };

  return (
    <div>
      <Helmet>
        <title>
          {`${data?.restaurant.restaurant?.name} | Nuber Eats` || "Loading..."}
        </title>
      </Helmet>
      <div
        className="bg-gray-800 bg-center bg-cover py-20"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-56 lg:w-1/3 py-4 pl-12 opacity-90">
          <h4 className="text-2xl lg:text-4xl mb-3">
            {data?.restaurant.restaurant?.name}
          </h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.name}`}>
            <h5 className=" text-gray-800 text-sm font-light">
              {data?.restaurant.restaurant?.category?.name}
            </h5>
          </Link>
          <h6 className=" text-gray-800 text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container flex flex-col items-end px-7 mt-8 pb-32 ">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn bg-lime-800 px-4">
            주문시작하기
          </button>
        )}
        {orderStarted && (
          <div className="flex">
            <button
              onClick={triggerConfirmOrder}
              className="btn bg-lime-800 px-4 mr-2"
            >
              주문확정하기
            </button>
            <button
              onClick={triggerCancelOrder}
              className="text-lg focus:outline-none font-medium text-white py-4 transition-colors hover:bg-red-700 bg-red-500 px-4"
            >
              주문취소하기
            </button>
          </div>
        )}
        <div className="w-full grid mt-8 gap-x-4 gap-y-7 md:grid-cols-3">
          {data?.restaurant.restaurant?.menu.map((menu) => (
            <Dish
              isSelected={isSelected(menu.id)}
              key={menu.id}
              id={menu.id}
              name={menu.name}
              price={menu.price}
              photo={menu.photo}
              description={menu.description}
              isCustomer={true}
              options={menu.options}
              orderStarted={orderStarted}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {menu.options?.map((option, index) => (
                <DishOption
                  key={`${menu.id}-${index}`}
                  isSelected={isOptionSelected(menu.id, option.name)}
                  dishId={menu.id}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
