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

const ClientRoutes = [
  <Route key={1} path="/" exact>
    <Restaurants />
  </Route>,
  // todo: 이유를 알 수 없지만, verifyEamil 의 api 가 'cofirm"으로 시작
  <Route key={2} path="/cofirm">
    <ConfirmEmail />
  </Route>,
  <Route key={3} path="/edit-profile">
    <EditProfile />
  </Route>,
  <Route key={4} path="/search">
    <Search />
  </Route>,
  <Route key={5} path="/category/:slug">
    <Category />
  </Route>,
  <Route key={6} path="/restaurant/:id">
    <Restaurant />
  </Route>,
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
        {data.me.role === "Client" && ClientRoutes}
        {/* 매칭되는 주소가 없다면 반드시 root로 돌아가게 하기 위해서 */}
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
