import { Link } from "react-router-dom";

function RecipeCard({ meal, query }) {
  return (
    <Link to={`/recipe/${meal.idMeal}`} state={{ fromSearch: true, query }}>
      <div>
        <h3>{meal.strMeal}</h3>
        <img src={meal.strMealThumb} alt={meal.strMeal} />
      </div>
    </Link>
  );
}

export default RecipeCard;
