/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/prefer-presence-queries */
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Login from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  it("renders OK", async () => {
    const mockClient = createMockClient();
    render(
      <ApolloProvider client={mockClient}>
        <HelmetProvider>
          <Router>
            <Login />
          </Router>
        </HelmetProvider>
      </ApolloProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("display Email validation errors", async () => {
    const mockClient = createMockClient();
    const { debug } = render(
      <ApolloProvider client={mockClient}>
        <HelmetProvider>
          <Router>
            <Login />
          </Router>
        </HelmetProvider>
      </ApolloProvider>
    );
    const email = screen.getByPlaceholderText(/이메일/);
    await waitFor(() => {
      expect(email).toBeInTheDocument();
    });
    userEvent.type(email, "test@test");
    await waitFor(() => {
      const input = screen.getByTestId("email-input");
      expect(input).toBe("test@test");
    });
    debug();
  });
});
