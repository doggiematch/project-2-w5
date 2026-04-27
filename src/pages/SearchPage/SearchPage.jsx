import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import ScrollTopButton from "../../components/ScrollTopButton/ScrollTopButton";
import styles from "./SearchPage.module.css";

function SearchPage() {
  const location = useLocation();
  const [initialQuery] = useState(() => location.state?.query || "");
  const [query, setQuery] = useState(initialQuery);
  const [lastQuery, setLastQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const { results, searchMeals, getRandomMeal, clearResults, loading, error } =
    useContext(FavoritesContext);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!initialQuery) {
      clearResults();
      localStorage.removeItem("lastQuery");
      return;
    }
    if (initialQuery === "random") {
      getRandomMeal(itemsPerPage);
      return;
    }
    searchMeals(initialQuery);
  }, [clearResults, getRandomMeal, initialQuery, searchMeals]);

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
    getRandomMeal(itemsPerPage);
    setQuery("");
    setLastQuery("random");
    setHasSearched(true);
    setCurrentPage(1);
    localStorage.setItem("lastQuery", "random");
  };
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const showResults = !loading && !error && hasSearched;

  return (
    <div className={styles.container}>
      <section className={styles.searchCard}>
        <p className={styles.smallText}>Search by ingredient</p>
        <h1 className={styles.title}>Find recipes</h1>
        <p className={styles.description}>
          Type one ingredient and discover meals you can cook with it.
        </p>
        <div className={styles.searchBox}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your ingredient or ingredients"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.primaryBtn} onClick={handleSearch}>
            Search
          </button>
          <button className={styles.secondaryBtn} onClick={handleClear}>
            Clear search
          </button>
          <button className={styles.secondaryBtn} onClick={handleRandom}>
            Random
          </button>
        </div>
      </section>
      {hasSearched && (
        <section className={styles.resultsInfo}>
          <h2 className={styles.subtitle}>
            You are viewing recipes with: {lastQuery}
          </h2>
          <p className={styles.resultsCount}>
            {results.length === 1
              ? "1 result found"
              : `${results.length} results found`}
          </p>
        </section>
      )}
      {loading && <p className={styles.status}>Loading recipe...</p>}
      {error && <p className={styles.status}>{error}</p>}
      {!loading && !error && !hasSearched && (
        <section className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Make your first search</h2>
          <p className={styles.emptyText}>Search by one or more ingredients</p>
        </section>
      )}
      {showResults && results.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div className={styles.resultsGrid}>
            {currentResults.map((meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} query={lastQuery} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    className={styles.pageBtn}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={currentPage === page}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {showResults && results.length === 0 && (
        <p className={styles.status}>No results found</p>
      )}
      <ScrollTopButton />
    </div>
  );
}

export default SearchPage;
