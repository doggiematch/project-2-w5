import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import ScrollTopButton from "../../components/ScrollTopButton/ScrollTopButton";
import styles from "./RecipeDetailPage.module.css";

const previewQuery = "(min-width: 1024px)";

function canOpenDesktopImagePreview() {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(previewQuery).matches;
}

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedMeal,
    getMealById,
    addFavorite,
    removeFavorite,
    favorites,
    loading,
    error,
  } = useContext(FavoritesContext);
  const [message, setMessage] = useState("");
  const [loadedMealId, setLoadedMealId] = useState(null);
  const [previewedMealId, setPreviewedMealId] = useState(null);
  const [canPreviewImage, setCanPreviewImage] = useState(
    canOpenDesktopImagePreview,
  );

  useEffect(() => {
    let isActive = true;
    const fallbackMeal = location.state?.meal;
    getMealById(id, fallbackMeal).finally(() => {
      if (isActive) {
        setLoadedMealId(id);
      }
    });
    return () => {
      isActive = false;
    };
  }, [id, getMealById, location.state]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (typeof window.matchMedia !== "function") return undefined;
    const mediaQuery = window.matchMedia(previewQuery);
    const handlePreviewChange = (event) => {
      setCanPreviewImage(event.matches);
      if (!event.matches) {
        setPreviewedMealId(null);
      }
    };

    mediaQuery.addEventListener("change", handlePreviewChange);

    return () => mediaQuery.removeEventListener("change", handlePreviewChange);
  }, []);

  const isCurrentMeal = selectedMeal?.idMeal === id;
  const hasFinishedLoading = loadedMealId === id && !loading;
  const imagePreviewOpen =
    canPreviewImage && previewedMealId === selectedMeal?.idMeal;

  useEffect(() => {
    if (!imagePreviewOpen) return undefined;
    const oldOverflow = document.body.style.overflow;
    const handleClosePreview = (event) => {
      if (event.key === "Escape") {
        setPreviewedMealId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleClosePreview);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleClosePreview);
    };
  }, [imagePreviewOpen]);

  if (!hasFinishedLoading || (selectedMeal && !isCurrentMeal)) {
    return (
      <div className={styles.container}>
        <section className={styles.card}>
          <p className={styles.status}>Loading recipe...</p>
        </section>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.container}>
        <section className={styles.card}>
          <p className={styles.status}>{error}</p>
        </section>
      </div>
    );
  }
  if (!selectedMeal) {
    return (
      <div className={styles.container}>
        <section className={styles.card}>
          <p className={styles.status}>Recipe not found.</p>
        </section>
      </div>
    );
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
  const hasInstructions = selectedMeal.strInstructions?.trim();
  const hasIngredients = ingredients.length > 0;

  const isFavorite = favorites.some(
    (fav) => fav.idMeal === selectedMeal.idMeal,
  );

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(selectedMeal.idMeal);
      setMessage("Removed from favorites");
    } else {
      addFavorite(selectedMeal);
      setMessage("Added to favorites");
    }
    setTimeout(() => setMessage(""), 2000);
  };

  const handleBack = () => {
    if (location.state?.fromSearch) {
      navigate("/search", { state: location.state });
    } else if (location.state?.fromFavorites) {
      navigate("/favorites");
    } else {
      navigate(-1);
    }
  };

  const openImagePreview = () => {
    if (!canPreviewImage) return;
    setPreviewedMealId(selectedMeal.idMeal);
  };

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <section className={`${styles.card} ${styles.heroCard}`}>
          <div className={styles.copy}>
            <p className={styles.smallText}>Recipe details</p>
            <h1 className={styles.title}>{selectedMeal.strMeal}</h1>
            <div className={styles.recipeFacts}>
              <p className={styles.recipeFact}>
                <span className={styles.recipeLabel}>Category</span>
                <span className={styles.recipeValue}>
                  {selectedMeal.strCategory || "Unknown"}
                </span>
              </p>
              <p className={styles.recipeFact}>
                <span className={styles.recipeLabel}>Area</span>
                <span className={styles.recipeValue}>
                  {selectedMeal.strArea || "Unknown"}
                </span>
              </p>
            </div>
            <div className={styles.buttons}>
              <button className={styles.secondaryBtn} onClick={handleBack}>
                Back
              </button>
              <button className={styles.primaryBtn} onClick={handleFavorite}>
                {isFavorite ? "Remove favorite" : "Add to favorites"}
              </button>
              {selectedMeal.strYoutube && (
                <a
                  className={styles.secondaryBtn}
                  href={selectedMeal.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch recipe video
                </a>
              )}
            </div>
            {message && <p className={styles.message}>{message}</p>}
          </div>
          <div className={styles.preview}>
            {canPreviewImage ? (
              <button
                aria-haspopup="dialog"
                aria-label={`Open a larger preview of ${selectedMeal.strMeal}`}
                className={styles.imageBtn}
                onClick={openImagePreview}
                type="button"
              >
                <img
                  className={styles.image}
                  src={selectedMeal.strMealThumb}
                  alt={selectedMeal.strMeal}
                />
              </button>
            ) : (
              <img
                className={styles.image}
                src={selectedMeal.strMealThumb}
                alt={selectedMeal.strMeal}
              />
            )}
            {canPreviewImage ? (
              <p className={styles.imageClick}>
                Click the image to view a larger version
              </p>
            ) : null}
          </div>
        </section>

        <section className={`${styles.card} ${styles.detailsCard}`}>
          <div className={styles.detailsLayout}>
            <section className={styles.ingredientsPanel}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              {hasIngredients ? (
                <ul className={styles.ingredientsList}>
                  {ingredients.map((item, index) => (
                    <li className={styles.ingredientItem} key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.status}>Ingredients are not available.</p>
              )}
            </section>
            <section className={styles.instructionsPanel}>
              <h2 className={styles.sectionTitle}>Instructions</h2>
              <p className={styles.instructionsText}>
                {hasInstructions
                  ? selectedMeal.strInstructions
                  : "Instructions are not available right now."}
              </p>
            </section>
          </div>
        </section>
      </div>

      {imagePreviewOpen ? (
        <div
          aria-modal="true"
          className={styles.imageModalBackdrop}
          onClick={() => setPreviewedMealId(null)}
          role="dialog"
        >
          <div
            className={styles.imageModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close image preview"
              className={styles.imageModalClose}
              onClick={() => setPreviewedMealId(null)}
              type="button"
            >
              Close
            </button>
            <img
              className={styles.imageModalImage}
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
            />
          </div>
        </div>
      ) : null}
      <ScrollTopButton />
    </div>
  );
}

export default RecipeDetailPage;
