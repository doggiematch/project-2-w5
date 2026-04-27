import { afterEach, test, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage/SearchPage";
import FavoritesProvider from "../context/FavoritesProvider";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("mensaje inicial previo búsqueda", () => {
  render(
    <FavoritesProvider>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  expect(screen.getByText(/Make your first search/i)).toBeInTheDocument();
});
