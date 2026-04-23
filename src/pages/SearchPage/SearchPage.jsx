import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import RecipeCard from "../../components/RecipeCard/RecipeCard";

function SearchPage() {
  const location = useLocation();
  const [initialQuery] = useState(
    () => location.state?.query || localStorage.getItem("lastQuery") || "",
  );
  const [query, setQuery] = useState(initialQuery);
  const [lastQuery, setLastQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const { results, searchMeals, getRandomMeal, clearResults, loading, error } =
    useContext(FavoritesContext);
  const itemsPerPage = 10;

  useEffect(() => {
    if (initialQuery && results.length === 0) {
      if (initialQuery === "random") {
        getRandomMeal();
      } else {
        searchMeals(initialQuery);
      }
    }
  }, [getRandomMeal, initialQuery, results.length, searchMeals]);

  const handleSearch = () => {
    if (!query.trim()) return;
    searchMeals(query);
    setLastQuery(query);
    setHasSearched(true);
    setCurrentPage(1);
    localStorage.setItem("lastQuery", query);
  };

  const handleClear = () => {
    setQuery("");
    setLastQuery("");
    setHasSearched(false);
    setCurrentPage(1);
    clearResults();
    localStorage.removeItem("lastQuery");
  };

  const handleRandom = () => {
    getRandomMeal();
    setLastQuery("random");
    setHasSearched(true);
    setCurrentPage(1);
    localStorage.setItem("lastQuery", "random");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <div>
      <h1>Search</h1>
      {hasSearched && (
        <>
          <h2>You are viewing recipes with: {lastQuery}</h2>
          <p>
            {results.length === 1
              ? "1 result found"
              : `${results.length} results found`}
          </p>
        </>
      )}

      <input
        type="text"
        placeholder="Enter your ingredient or ingredients"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClear}>Clear search</button>
      <button onClick={handleRandom}>Random</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading &&
        !error &&
        hasSearched &&
        (currentResults.length > 0 ? (
          <>
            {currentResults.map((meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} query={lastQuery} />
            ))}
            {totalPages > 1 && (
              <div>
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={currentPage === page}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No results found</p>
        ))}
    </div>
  );
}

export default SearchPage;
