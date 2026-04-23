import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";

function FavoritePage() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  return (
    <div>
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorite recipes</p>
      ) : (
        <div>
          {favorites.map((meal) => (
            <article key={meal.idMeal}>
              <Link to={`/recipe/${meal.idMeal}`}>
                <h3>{meal.strMeal}</h3>
                <img src={meal.strMealThumb} alt={meal.strMeal} />
              </Link>
              <button onClick={() => removeFavorite(meal.idMeal)}>
                Remove this receipt from your favorites
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritePage;
