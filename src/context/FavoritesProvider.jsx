import { useCallback, useEffect, useMemo, useState } from "react";
import { FavoritesContext } from "./FavoritesContext";

function getStoredList(key) {
  try {
    const savedItems = localStorage.getItem(key);
    return savedItems ? JSON.parse(savedItems) : [];
  } catch {
    return [];
  }
}

function saveResults(meals) {
  localStorage.setItem("results", JSON.stringify(meals));
}

function getErrorMessage() {
  return "An error has occurred.";
}

function mealHasDetails(meal) {
  return Boolean(meal?.strInstructions?.trim() && getMealIngredients(meal).length);
}

function fetchMealById(id) {
  return fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
      id,
    )}`,
  ).then((res) => {
    if (!res.ok) {
      throw new Error(getErrorMessage());
    }
    return res.json();
  });
}

function getUniqueMeals(meals) {
  return meals.filter(
    (meal, index, mealList) =>
      mealList.findIndex((item) => item.idMeal === meal.idMeal) === index,
  );
}

function getIntersectingMeals(mealsArrays) {
  return mealsArrays.reduce((matches, meals, index) => {
    if (index === 0) {
      return meals;
    }
    const mealIds = new Set(meals.map((meal) => meal.idMeal));
    return matches.filter((meal) => mealIds.has(meal.idMeal));
  }, []);
}

function parseIngredients(query) {
  return query
    .split(/[,;\n]+|\s+(?:and|y)\s+/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeIngredient(value) {
  return value.trim().toLowerCase();
}

function getMealIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[`strIngredient${index + 1}`];
    return ingredient ? normalizeIngredient(ingredient) : "";
  }).filter(Boolean);
}

function mealMatchesIngredients(meal, ingredients) {
  const mealIngredients = getMealIngredients(meal);

  return ingredients.every((ingredient) =>
    mealIngredients.some((mealIngredient) =>
      mealIngredient.includes(normalizeIngredient(ingredient)),
    ),
  );
}

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getStoredList("favorites"));
  const [results, setResults] = useState(() => getStoredList("results"));
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchMeals = useCallback((query) => {
    setLoading(true);
    setError("");
    const ingredients = parseIngredients(query);
    if (ingredients.length === 0) {
      setResults([]);
      saveResults([]);
      setLoading(false);
      return;
    }

    return Promise.allSettled(
      ingredients.map((ingredient) =>
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
            ingredient,
          )}`,
        ).then((res) => {
          if (!res.ok) {
            throw new Error("An error has occurred");
          }
          return res.json();
        }),
      ),
    )
      .then((ingredientResults) => {
        const data = ingredientResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
        const mealsArrays = data.map((res) => res.meals || []);

        if (mealsArrays.length === 0) {
          setResults([]);
          saveResults([]);
          return;
        }

        const candidateMeals = getUniqueMeals(mealsArrays.flat());
        const intersectingMeals = getIntersectingMeals(mealsArrays);

        if (intersectingMeals.length > 0 || ingredients.length === 1) {
          setResults(intersectingMeals);
          saveResults(intersectingMeals);
          return;
        }

        if (candidateMeals.length > 0) {
          return Promise.allSettled(
            candidateMeals.map((meal) =>
              fetchMealById(meal.idMeal),
            ),
          ).then((mealDetails) => {
            const matchingMeals = mealDetails
              .filter((result) => result.status === "fulfilled")
              .map((result) => result.value.meals?.[0])
              .filter(Boolean)
              .filter((meal) => mealMatchesIngredients(meal, ingredients));
            const mealsToSave =
              matchingMeals.length > 0 ? matchingMeals : intersectingMeals;

            setResults(mealsToSave);
            saveResults(mealsToSave);
          });
        }

        setResults([]);
        saveResults([]);
      })
      .catch(() => {
        setError(getErrorMessage());
        setResults([]);
        saveResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRandomMeal = useCallback((amount = 1) => {
    setLoading(true);
    setError("");
    const totalMeals = Number.isInteger(amount) ? amount : 1;
    const randomRequests = Array.from({ length: totalMeals }, () =>
      fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
        (res) => {
          if (!res.ok) {
            throw new Error(getErrorMessage());
          }
          return res.json();
        },
      ),
    );

    return Promise.all(randomRequests)
      .then((data) => {
        const randomMeals = data
          .map((result) => result.meals?.[0])
          .filter(Boolean);
        setResults(randomMeals);
        saveResults(randomMeals);
      })
      .catch(() => {
        setError(getErrorMessage());
        setResults([]);
        saveResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError("");
    localStorage.removeItem("results");
  }, []);

  const getMealById = useCallback((id, fallbackMeal = null) => {
    setLoading(true);
    setError("");
    setSelectedMeal(fallbackMeal?.idMeal === id ? fallbackMeal : null);

    return fetchMealById(id)
      .then((data) => {
        setSelectedMeal(data.meals?.[0] || null);
      })
      .catch(() => {
        if (fallbackMeal?.idMeal === id) {
          setSelectedMeal(fallbackMeal);
          return;
        }

        setError(getErrorMessage());
        setSelectedMeal(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addFavorite = useCallback((meal) => {
    setFavorites((currentFavorites) => {
      const alreadyExists = currentFavorites.some(
        (favorite) => favorite.idMeal === meal.idMeal,
      );

      return alreadyExists ? currentFavorites : [...currentFavorites, meal];
    });

    if (!mealHasDetails(meal)) {
      fetchMealById(meal.idMeal)
        .then((data) => {
          const detailedMeal = data.meals?.[0];
          if (!detailedMeal) return;
          setFavorites((currentFavorites) =>
            currentFavorites.map((favorite) =>
              favorite.idMeal === detailedMeal.idMeal
                ? detailedMeal
                : favorite,
            ),
          );
          setSelectedMeal((currentMeal) =>
            currentMeal?.idMeal === detailedMeal.idMeal
              ? detailedMeal
              : currentMeal,
          );
        })
        .catch(() => {});
    }
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((meal) => meal.idMeal !== id),
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      results,
      searchMeals,
      getRandomMeal,
      clearResults,
      selectedMeal,
      getMealById,
      loading,
      error,
    }),
    [
      favorites,
      addFavorite,
      removeFavorite,
      results,
      searchMeals,
      getRandomMeal,
      clearResults,
      selectedMeal,
      getMealById,
      loading,
      error,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesProvider;
