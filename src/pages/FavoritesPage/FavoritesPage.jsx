import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import ScrollTopButton from "../../components/ScrollTopButton/ScrollTopButton";
import { useDebounce } from "../../hooks/useDebounce";
import styles from "./FavoritesPage.module.css";

function FavoritesPage() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const debouncedQuery = useDebounce(query, 300);

  const filteredFavorites = favorites.filter((meal) =>
    meal.strMeal.toLowerCase().includes(debouncedQuery.trim().toLowerCase()),
  );
  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const indexOfLast = safeCurrentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFavorites = filteredFavorites.slice(indexOfFirst, indexOfLast);

  const handleClear = () => {
    setQuery("");
    setCurrentPage(1);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleRemoveFavorite = (meal) => {
    const wantsToRemove = window.confirm(
      `Do you want to remove "${meal.strMeal}" from your favorites?`,
    );

    if (wantsToRemove) {
      removeFavorite(meal.idMeal);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.searchCard}>
        <p className={styles.smallText}>Saved recipes</p>
        <h1 className={styles.title}>Favorites</h1>
        <p className={styles.description}>
          Search inside the recipes you saved.
        </p>
        <div className={styles.searchBox}>
          <input
            className={styles.input}
            type="text"
            placeholder="Search your favorite recipes"
            value={query}
            onChange={handleQueryChange}
          />
          <button className={styles.secondaryBtn} onClick={handleClear}>
            Clear search
          </button>
        </div>
      </section>

      <section className={styles.resultsInfo}>
        <h2 className={styles.subtitle}>Your favorite recipes</h2>
        <p className={styles.resultsCount}>
          {filteredFavorites.length === 1
            ? "1 favorite recipe"
            : `${filteredFavorites.length} favorite recipes`}
        </p>
      </section>

      {favorites.length === 0 ? (
        <section className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No favorite recipes</h2>
          <p className={styles.emptyText}>
            Save recipes from the search page to find them here.
          </p>
        </section>
      ) : filteredFavorites.length === 0 ? (
        <p className={styles.status}>No favorite recipes found</p>
      ) : (
        <>
          <div className={styles.resultsGrid}>
            {currentFavorites.map((meal) => (
              <article className={styles.card} key={meal.idMeal}>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveFavorite(meal)}
                  aria-label={`Remove ${meal.strMeal} from favorites`}
                >
                  X
                </button>
                <Link className={styles.cardLink} to={`/recipe/${meal.idMeal}`}>
                  <img
                    className={styles.image}
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                  />
                  <h3 className={styles.cardTitle}>{meal.strMeal}</h3>
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={safeCurrentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    className={styles.pageBtn}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={safeCurrentPage === page}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <ScrollTopButton />
    </div>
  );
}

export default FavoritesPage;
