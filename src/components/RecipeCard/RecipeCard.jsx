import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import toggleStyles from "../../pages/HomePage/HomePage.module.css";
import styles from "./RecipeCard.module.css";

function RecipeCard({ meal, query }) {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.some((favorite) => favorite.idMeal === meal.idMeal);

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(meal.idMeal);
      return;
    }

    addFavorite(meal);
  };

  return (
    <article className={styles.card}>
      <button
        aria-checked={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={`${toggleStyles.favoriteToggle} ${styles.favoriteToggleSmall} ${
          isFavorite ? toggleStyles.favoriteToggleOn : ""
        }`}
        onClick={handleFavorite}
        role="switch"
        type="button"
      >
        <span className={toggleStyles.favoriteToggleText}>Favorite</span>
        <span className={toggleStyles.favoriteToggleTrack}>
          <span className={toggleStyles.favoriteToggleThumb} />
        </span>
      </button>
      <Link
        className={styles.cardLink}
        to={`/recipe/${meal.idMeal}`}
        state={{ fromSearch: true, query, meal }}
      >
        <img
          className={styles.image}
          src={meal.strMealThumb}
          alt={meal.strMeal}
        />
        <h3 className={styles.title}>{meal.strMeal}</h3>
      </Link>
    </article>
  );
}

export default RecipeCard;
