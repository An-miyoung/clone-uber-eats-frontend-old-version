import React from "react";
import { isLoggedInVar } from "../apollo";

const LoggedInRouter = () => {
  const onClick = () => {
    isLoggedInVar(false);
  };
  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={onClick}>Click to logout</button>
    </div>
  );
};

export default LoggedInRouter;
