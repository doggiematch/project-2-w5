import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import FavoritesProvider from "../context/FavoritesProvider";

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
