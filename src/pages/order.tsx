import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import { FULL_ORDERS_FRAGMENTS } from "../new-fragments";
import { orderUpdates } from "../__generated__/orderUpdates";
import useMe from "../hooks/useMe";
import { editOrder, editOrderVariables } from "../__generated__/editOrder";
import { OrderStatus, UserRole } from "../__generated__/globalTypes";

interface IParams {
  id: string;
}

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDERS_FRAGMENTS}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdateInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDERS_FRAGMENTS}
`;

export const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

const Order = () => {
  const { id } = useParams<IParams>();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER
  );

  const onBtnClick = useCallback(
    (newStatus: OrderStatus) => {
      editOrderMutation({
        variables: {
          input: {
            id: +id,
            status: newStatus,
          },
        },
      });
    },
    [editOrderMutation, id]
  );

  // query 와 subscription 을 각각 부를때 사용
  // const { data } = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
  //   variables: {
  //     input: {
  //       id: +id,
  //     },
  //   },
  // });
  //
  // 요리의 진행상황을 subscriptiom 을 통해서 받아서 따로 상태관리를 하면서 render 시켜줘야 한다.
  // const { data: subscriptionData } = useSubscription<
  //   orderUpdates,
  //   orderUpdatesVariables
  // >(ORDER_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       id: +id,
  //     },
  //   },
  // });

  // query 와 subscription 같이 부를때 - subscription 이 일어나면 자동 query 내용을 고쳐준다.
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          // getOrder 과 subscription 의 output 의 구조가 다르다. getOrder 는 ok,error 포함
          // subscription 의 구조를 getOrder 처럼 만들어 주기 위해서
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore, onBtnClick]);

  console.log(data);

  return (
    <div className=" mt-16 mb-10 container flex justify-center">
      <Helmet>
        <title>Order Detail #{id} | Nuber Eats</title>
      </Helmet>
      <div className=" border border-gray-800 w-auto max-w-screen-sm flex flex-col justify-center mx-5">
        <h4 className=" bg-gray-800 w-full py-5 text-white text-center text-xl">
          주문번호 #{id}
        </h4>
        <h5 className="p-4 pt-10 text-3xl text-center">
          {data?.getOrder.order?.total?.toLocaleString("ko-KR")}원
        </h5>
        <div className="py-5 px-6 text-xl grid gap-6 text-gray-400">
          <div className=" border-t pt-6 border-gray-700 ">
            주문접수 식당 : {""}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            주문고객 :{" "}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            배달라이더 :{" "}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-2 mb-5 text-xl text-lime-600">
              진행상황 : {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onBtnClick(OrderStatus.Cooking)}
                  className="btn bg-lime-600"
                >
                  주문수락 & 조리시작
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onBtnClick(OrderStatus.Cooked)}
                  className="btn bg-lime-600"
                >
                  주문 조리완료
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-2 mb-5 text-xl text-lime-600">
                    진행상황 : {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onBtnClick(OrderStatus.PickedUp)}
                  className="btn bg-lime-600"
                >
                  배달시작
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onBtnClick(OrderStatus.Delivered)}
                  className="btn bg-lime-600"
                >
                  배달완료
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <>
              <span className=" text-center mt-2 text-xl text-lime-600">
                배달이 완료됐습니다.
              </span>
              <span className=" text-center  mb-5  text-xl text-lime-600">
                Nuber Eats를 이용해 주셔서 감사합니다.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
