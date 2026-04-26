import { Link } from "react-router-dom";
import styles from "./RecipeCard.module.css";

function RecipeCard({ meal, query }) {
  return (
    <Link
      className={styles.cardLink}
      to={`/recipe/${meal.idMeal}`}
      state={{ fromSearch: true, query }}
    >
      <div className={styles.card}>
        <img
          className={styles.image}
          src={meal.strMealThumb}
          alt={meal.strMeal}
        />
        <h3 className={styles.title}>{meal.strMeal}</h3>
      </div>
    </Link>
  );
}

export default RecipeCard;
