import { render, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PageNotFound from "../404";
import { HelmetProvider } from "react-helmet-async";

describe("<PageNotFound />", () => {
  it("renders OK", async () => {
    render(
      <HelmetProvider>
        <Router>
          <PageNotFound />
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Page not Found | Nuber Eats");
    });
  });
});
