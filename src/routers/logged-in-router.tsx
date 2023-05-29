import React from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Restaurants from "../pages/client/restaurants";
import Header from "../components/header";
import useMe from "../hooks/useMe";

const ClientRoutes = [
  <Route path="/" exact>
    <Restaurants />
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
      <Switch>{data.me.role === "Client" && ClientRoutes}</Switch>
      {/* 매칭되는 주소가 없다면 반드시 root로 돌아가게 하기 위해서 */}
      <Redirect to="/" />
    </Router>
  );
};

export default LoggedInRouter;
