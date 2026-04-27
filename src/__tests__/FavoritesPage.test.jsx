import { afterEach, test, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import FavoritesProvider from "../context/FavoritesProvider";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("renderiza favoritos", () => {
  render(
    <FavoritesProvider>
      <BrowserRouter>
        <FavoritesPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
});

test("muestra mensaje no favoritos", () => {
  render(
    <FavoritesProvider>
      <BrowserRouter>
        <FavoritesPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  expect(screen.getByText(/No favorite recipes/i)).toBeInTheDocument();
});
