import { render, waitFor } from "@testing-library/react";
import React from "react";
import { App } from "../app";
import { isLoggedInVar } from "../../apollo";

jest.mock(
  "../../routers/logged-out-router",
  () =>
    function LoggedOutRouter() {
      return <span>Logged-out</span>;
    }
);

jest.mock(
  "../../routers/logged-in-router",
  () =>
    function LoggedInRouter() {
      return <span>Logged-in</span>;
    }
);

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    getByText("Logged-out");
  });
  it("renders LoggedInRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    // eslint-disable-next-line testing-library/prefer-screen-queries
    getByText("Logged-in");
  });
});
