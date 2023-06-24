import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Restaurants from "../pages/client/restaurants";
import Header from "../components/header";
import useMe from "../hooks/useMe";
import PageNotFound from "../pages/404";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";
import Search from "../pages/client/search";
import Category from "../pages/client/category";
import Restaurant from "../pages/client/restaurant";
import MyRestaurants from "../pages/owner/my-restaurants";
import AddRestaurants from "../pages/owner/add-restaurants";
import MyRestaurant from "../pages/owner/my-restaurant";
import AddDish from "../pages/owner/add-dish";
import Order from "../pages/order";
import Dashboard from "../pages/drivers/dashboard";
import { UserRole } from "../__generated__/globalTypes";

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
  {
    path: "/orders/:id",
    component: <Order />,
  },
];

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/restaurant/:id",
    component: <Restaurant />,
  },
];

const restaurantRoutes = [
  {
    path: "/",
    component: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    component: <AddRestaurants />,
  },
  {
    path: "/restaurant/:id",
    component: <MyRestaurant />,
  },
  {
    path: "/restaurant/:id/add-dish",
    component: <AddDish />,
  },
];

const driverRoutes = [
  {
    path: "/",
    component: <Dashboard />,
  },
];

const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route exact key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        {/* 매칭되는 주소가 없다면 반드시 root로 돌아가게 하기 위해서 */}
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
