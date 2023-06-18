import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";
import RESTAURANT_FRAGMENTS from "../../fragments";
import {
  myRestaurantDashboard,
  myRestaurantDashboardVariables,
} from "../../__generated__/myRestaurantDashboard";
import {
  DISH_FRAGMENTS,
  FULL_ORDERS_FRAGMENTS,
  ORDERS_FRAGMENTS,
} from "../../new-fragments";
import Dish from "../../components/dish";
import { Helmet } from "react-helmet-async";
import { pendingOrders } from "../../__generated__/pendingOrders";

interface IParams {
  id: string;
}

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurantDashboard($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENTS}
  ${DISH_FRAGMENTS}
  ${ORDERS_FRAGMENTS}
`;

// 새로운 order가 만들어졌는지 subscribe
const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDERS_FRAGMENTS}
`;

const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const history = useHistory();
  const { data } = useQuery<
    myRestaurantDashboard,
    myRestaurantDashboardVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });

  const triggerPaddle = () => {
    // @ts-ignore
    window.Paddle.Setup({ vendor: 172762 });
    // @ts-ignore
    window.Paddle.Checkout.open({
      method: "inline",
      product: 837210,
    });
  };

  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  console.log(subscriptionData);

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [history, subscriptionData]);

  return (
    <div className="mb-16">
      <Helmet>
        <title>{data?.myRestaurant.restaurant?.name || "Loading..."}</title>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Helmet>
      <div
        className=" bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container w-full px-7 mt-8">
        <div className="flex">
          <Link
            to={`/restaurant/${data?.myRestaurant.restaurant?.id}/add-dish`}
            className="mr-8 text-white bg-gray-800 py-3 px-10"
          >
            메뉴 만들기 &rarr;
          </Link>
          <span
            onClick={triggerPaddle}
            className="cursor-pointer text-white bg-lime-700 py-3 px-10"
          >
            프로모션 구매하기 &rarr;
          </span>
        </div>
        <div className="mt-8">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <span>메뉴가 없습니다. 메뉴를 추가해 주세요.</span>
          ) : (
            <div className="grid mt-10 gap-x-4 gap-y-7 md:grid-cols-3">
              {data?.myRestaurant.restaurant?.menu.map((menu) => (
                <Dish
                  key={menu.id}
                  id={menu.id}
                  name={menu.name}
                  price={menu.price}
                  photo={menu.photo}
                  description={menu.description}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-10">
          <h4 className=" text-center text-xl font-medium">매출통계</h4>
          <div className=" mt-8">
            <VictoryChart
              theme={VictoryTheme.material}
              height={500}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `${datum.y}만원`}
                labelComponent={<VictoryLabel renderInPortal dy={-20} />}
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    stroke: "green",
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: { fontSize: 15, fill: "#4d7c0f" },
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
