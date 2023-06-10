/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable testing-library/prefer-screen-queries */
import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "../header";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header />", () => {
  it("render without verify banner", async () => {
    const { debug, findByText, queryByText, getByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "test@email.com",
                  role: "testRole",
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    // data 가 들어오기 전에 무조건 찾아본다. 있기 때문에 통과
    getByText("Please verify your email.");

    //  waitFor 를 사용해서 data가 들어온 후 expect 하도록 기다린다. verified 됐기때문에 통과
    await waitFor(() => {
      expect(queryByText("Please verify your email.")).toBeNull();
    });
  });
});
