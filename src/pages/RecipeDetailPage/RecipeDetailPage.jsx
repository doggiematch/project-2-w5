import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMeal, getMealById, addFavorite, favorites, loading, error } =
    useContext(FavoritesContext);
  const [message, setMessage] = useState("");
  const [loadedMealId, setLoadedMealId] = useState(null);

  useEffect(() => {
    let isActive = true;
    getMealById(id).finally(() => {
      if (isActive) {
        setLoadedMealId(id);
      }
    });
    return () => {
      isActive = false;
    };
  }, [id, getMealById]);

  const isCurrentMeal = selectedMeal?.idMeal === id;
  const hasFinishedLoading = loadedMealId === id && !loading;

  if (!hasFinishedLoading || (selectedMeal && !isCurrentMeal)) {
    return <p>Loading recipe...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (!selectedMeal) {
    return <p>Recipe not found.</p>;
  }
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = selectedMeal[`strIngredient${i}`];
    const measure = selectedMeal[`strMeasure${i}`];
    if (ingredient?.trim()) {
      ingredients.push(
        measure?.trim() ? `${ingredient} - ${measure}` : ingredient,
      );
    }
  }

  const handleFavorite = () => {
    const alreadyExists = favorites.some(
      (fav) => fav.idMeal === selectedMeal.idMeal,
    );
    if (alreadyExists) {
      setMessage("Already in favorites");
    } else {
      addFavorite(selectedMeal);
      setMessage("Added to favorites");
    }
    setTimeout(() => setMessage(""), 2000);
  };

  const handleBack = () => {
    if (location.state?.fromSearch) {
      navigate("/search", { state: location.state });
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <button onClick={handleBack}>Back</button>
      <h1>{selectedMeal.strMeal}</h1>
      <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
      <p>
        <strong>Category:</strong> {selectedMeal.strCategory}
      </p>
      <p>
        <strong>Area:</strong> {selectedMeal.strArea}
      </p>
      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{selectedMeal.strInstructions}</p>
      {selectedMeal.strYoutube && (
        <a href={selectedMeal.strYoutube} target="_blank" rel="noreferrer">
          Watch recipe video
        </a>
      )}
      <button onClick={handleFavorite}>Add to favorites</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RecipeDetailPage;
