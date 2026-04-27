import { afterEach, test, expect, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage/RecipeDetailPage";
import FavoritesProvider from "../context/FavoritesProvider";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

test("renderiza favoritos", () => {
  render(
    <FavoritesProvider>
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    </FavoritesProvider>,
  );

  expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
});

test("muestra mensaje no favoritos", () => {
  render(
    <FavoritesProvider>
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    </FavoritesProvider>,
  );

  expect(screen.getByText(/No favorite recipes/i)).toBeInTheDocument();
});

test("permite acceder al detalle desde favoritos si falla la API", async () => {
  localStorage.setItem(
    "favorites",
    JSON.stringify([
      {
        idMeal: "5",
        strMeal: "Favorite Pasta",
        strMealThumb: "https://example.com/favorite-pasta.jpg",
      },
    ]),
  );
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: false,
    json: async () => ({}),
  });

  render(
    <FavoritesProvider>
      <MemoryRouter initialEntries={["/favorites"]}>
        <Routes>
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>
    </FavoritesProvider>,
  );

  fireEvent.click(screen.getByRole("link", { name: /Favorite Pasta/i }));

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Favorite Pasta" })).toBeInTheDocument();
  });
  expect(screen.queryByText("An error has occurred.")).not.toBeInTheDocument();
});

test("filtra favoritos por ingrediente", async () => {
  localStorage.setItem(
    "favorites",
    JSON.stringify([
      {
        idMeal: "6",
        strMeal: "Sunday Roast",
        strMealThumb: "https://example.com/sunday-roast.jpg",
        strIngredient1: "Chicken",
      },
      {
        idMeal: "7",
        strMeal: "Garden Bowl",
        strMealThumb: "https://example.com/garden-bowl.jpg",
        strIngredient1: "Lettuce",
      },
    ]),
  );

  render(
    <FavoritesProvider>
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    </FavoritesProvider>,
  );

  fireEvent.change(screen.getByPlaceholderText(/Search by ingredient/i), {
    target: { value: "chicken" },
  });

  await waitFor(() => {
    expect(screen.getByText("Sunday Roast")).toBeInTheDocument();
    expect(screen.queryByText("Garden Bowl")).not.toBeInTheDocument();
  });
});
