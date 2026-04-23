import { useEffect, useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { Link } from "react-router-dom";

function Homepage() {
  const { results, getRandomMeal, loading, error } =
    useContext(FavoritesContext);
  useEffect(() => {
    getRandomMeal();
  }, [getRandomMeal]);
  const meal = results[0];
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!meal) return null;

  return (
    <div>
      <h1>Random Recipe</h1>
      <h2>{meal.strMeal}</h2>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <p>{meal.strInstructions}</p>
      <button onClick={getRandomMeal}>Surprise me!</button>
      <Link to="/search">
        {
          <button>
            Search by ingredient
          </button> /*comprobar por qué no funciona, no se ve */
        }
      </Link>
    </div>
  );
}

export default Homepage;
