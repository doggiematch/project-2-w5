import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage/SearchPage";
import FavoritesProvider from "../context/FavoritesProvider";

test("actualiza valor entrada input", () => {
  render(
    <FavoritesProvider>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </FavoritesProvider>,
  );

  const input = screen.getByPlaceholderText(/Enter ingredients/i);
  fireEvent.change(input, { target: { value: "egg" } });
  expect(input.value).toBe("egg");
});
