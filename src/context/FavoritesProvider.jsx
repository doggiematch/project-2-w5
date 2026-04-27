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
    const ingredients = query
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (ingredients.length === 0) {
      setResults([]);
      saveResults([]);
      setLoading(false);
      return;
    }

    return Promise.all(
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
      .then((data) => {
        const mealsArrays = data.map((res) => res.meals || []);
        const candidateMeals = mealsArrays
          .flat()
          .filter(
            (meal, index, meals) =>
              meals.findIndex((item) => item.idMeal === meal.idMeal) === index,
          );

        if (ingredients.length > 1 && candidateMeals.length > 0) {
          return Promise.all(
            candidateMeals.map((meal) =>
              fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
                  meal.idMeal,
                )}`,
              ).then((res) => {
                if (!res.ok) {
                  throw new Error("An error has occurred");
                }
                return res.json();
              }),
            ),
          ).then((mealDetails) => {
            const matchingMeals = mealDetails
              .map((result) => result.meals?.[0])
              .filter(Boolean)
              .filter((meal) => mealMatchesIngredients(meal, ingredients));

            setResults(matchingMeals);
            saveResults(matchingMeals);
          });
        }

        const matchingMeals = mealsArrays.reduce((matches, meals, index) => {
          if (index === 0) {
            return meals;
          }
          const mealIds = new Set(meals.map((meal) => meal.idMeal));
          return matches.filter((meal) => mealIds.has(meal.idMeal));
        }, []);
        setResults(matchingMeals);
        saveResults(matchingMeals);
      })
      .catch(() => {
        setError("An error has occurred");
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
            throw new Error("An error has occurred");
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
        setError("An error has occurred.");
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

  const getMealById = useCallback((id) => {
    setLoading(true);
    setError("");
    setSelectedMeal(null);

    return fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
        id,
      )}`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("An error has occurred");
        }
        return res.json();
      })
      .then((data) => {
        setSelectedMeal(data.meals?.[0] || null);
      })
      .catch(() => {
        setError("An error has occurred.");
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
