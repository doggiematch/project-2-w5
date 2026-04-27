import { afterEach, test, expect, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage/SearchPage";
import FavoritesProvider from "../context/FavoritesProvider";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

test("actualiza valor entrada input", () => {
  render(
    <FavoritesProvider>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  const input = screen.getByPlaceholderText(
    /Enter your ingredient or ingredients/i,
  );
  fireEvent.change(input, { target: { value: "egg" } });
  expect(input.value).toBe("egg");
});

test("muestra recetas posterior búsqueda", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      meals: [
        {
          idMeal: "1",
          strMeal: "Egg Drop Soup",
          strMealThumb: "https://example.com/egg.jpg",
        },
      ],
    }),
  });

  render(
    <FavoritesProvider>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  const input = screen.getByPlaceholderText(
    /Enter your ingredient or ingredients/i,
  );

  fireEvent.change(input, { target: { value: "egg" } });
  fireEvent.click(screen.getByRole("button", { name: /^search$/i }));

  await waitFor(() => {
    expect(screen.getByText("Egg Drop Soup")).toBeInTheDocument();
  });
});

test("recetas varios ingredientes", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
    if (url.includes("filter.php?i=orange")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ meals: null }),
      });
    }

    if (url.includes("filter.php?i=chicken")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          meals: [
            {
              idMeal: "2",
              strMeal: "Orange Chicken",
              strMealThumb: "https://example.com/orange-chicken.jpg",
            },
          ],
        }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        meals: [
          {
            idMeal: "2",
            strMeal: "Orange Chicken",
            strMealThumb: "https://example.com/orange-chicken.jpg",
            strIngredient1: "Chicken",
            strIngredient2: "Orange",
          },
        ],
      }),
    });
  });

  render(
    <FavoritesProvider>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  const input = screen.getByPlaceholderText(
    /Enter your ingredient or ingredients/i,
  );

  fireEvent.change(input, { target: { value: "orange, chicken" } });
  fireEvent.click(screen.getByRole("button", { name: /^search$/i }));

  await waitFor(() => {
    expect(screen.getByText("Orange Chicken")).toBeInTheDocument();
  });
});
