import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import styles from "./HomePage.module.css";

const instructionsMaxLength = 320;
const previewQuery = "(min-width: 1024px)";

function canOpenDesktopImagePreview() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(previewQuery).matches;
}

function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient?.trim()) {
      ingredients.push(
        measure?.trim() ? `${ingredient} - ${measure}` : ingredient,
      );
    }
  }
  return ingredients.sort((firstIngredient, secondIngredient) =>
    firstIngredient.localeCompare(secondIngredient),
  );
}

function getInstructionsPreview(text) {
  if (!text) return "";
  if (text.length <= instructionsMaxLength) return text;
  const shortText = text.slice(0, instructionsMaxLength);
  const cutIndex = shortText.lastIndexOf(" ");
  return `${cutIndex > 0 ? shortText.slice(0, cutIndex) : shortText}...`;
}

function Homepage() {
  const {
    results,
    getRandomMeal,
    loading,
    error,
    favorites,
    addFavorite,
    removeFavorite,
  } = useContext(FavoritesContext);
  const [expandedMealId, setExpandedMealId] = useState(null);
  const [previewedMealId, setPreviewedMealId] = useState(null);
  const [canPreviewImage, setCanPreviewImage] = useState(
    canOpenDesktopImagePreview,
  );

  useEffect(() => {
    getRandomMeal();
  }, [getRandomMeal]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
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

  const meal = results[0];
  const imagePreviewOpen = canPreviewImage && previewedMealId === meal?.idMeal;

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
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.status}>Loading recipe...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.status}>{error}</p>
        </div>
      </div>
    );
  }

  if (!meal || !meal.strInstructions) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.status}>Loading recipe...</p>
          <button
            className={styles.primaryBtn}
            onClick={() => getRandomMeal()}
            type="button"
          >
            Surprise me!
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(
    (favorite) => favorite.idMeal === meal.idMeal,
  );
  const instructionsExpanded = expandedMealId === meal.idMeal;
  const ingredients = getIngredients(meal);
  const instructionsPreview = getInstructionsPreview(meal.strInstructions);
  const hasOverflow = meal.strInstructions.length > instructionsPreview.length;
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(meal.idMeal);
      return;
    }
    addFavorite(meal);
  };

  const openImagePreview = () => {
    if (!canPreviewImage) return;
    setPreviewedMealId(meal.idMeal);
  };

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <section className={`${styles.card} ${styles.heroCard}`}>
          <div className={styles.copy}>
            <p className={styles.smallText}>
              Cook smarter with what you already have.
            </p>
            <h1 className={styles.title}>What&apos;s in my fridge?</h1>
            <p className={styles.claim}>
              Turn forgotten ingredients into easy meal ideas before they go to
              waste.
            </p>
            <p className={styles.instructions}>
              Tap <strong>Surprise me!</strong> for a random recipe, or choose{" "}
              <strong>Search by ingredient</strong> to explore dishes based on
              what is already in your kitchen.
            </p>
            <div className={styles.buttons}>
              <button
                className={styles.primaryBtn}
                onClick={() => getRandomMeal()}
              >
                Surprise me!
              </button>
              <Link className={styles.secondaryBtn} to="/search">
                Search by ingredient
              </Link>
            </div>
          </div>
          <div className={styles.preview}>
            <div className={styles.imageBox}>
              <button
                aria-checked={isFavorite}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                className={`${styles.favoriteToggle} ${
                  isFavorite ? styles.favoriteToggleOn : ""
                }`}
                onClick={handleFavoriteToggle}
                role="switch"
                type="button"
              >
                <span className={styles.favoriteToggleText}>Favorite</span>
                <span className={styles.favoriteToggleTrack}>
                  <span className={styles.favoriteToggleThumb} />
                </span>
              </button>
              {canPreviewImage ? (
                <button
                  aria-haspopup="dialog"
                  aria-label={`Open a larger preview of ${meal.strMeal}`}
                  className={styles.imageBtn}
                  onClick={openImagePreview}
                  type="button"
                >
                  <img
                    className={styles.image}
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                  />
                </button>
              ) : (
                <img
                  className={styles.image}
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                />
              )}
            </div>
            <p className={styles.previewLabel}>Today&apos;s inspiration</p>
            <h2 className={styles.mealName}>{meal.strMeal}</h2>
          </div>
          {canPreviewImage ? (
            <p className={styles.imageClick}>
              Click the image to view a larger version
            </p>
          ) : null}
        </section>
        <a
          aria-label="Jump to the full recipe details"
          className={styles.detailsJump}
          href="#recipe-details"
        >
          <span className={styles.detailsJumpArrow}>&darr;</span>
        </a>

        <section
          className={`${styles.card} ${styles.detailsCard}`}
          id="recipe-details"
        >
          <div className={styles.detailsHeader}>
            <div>
              <p className={styles.detailsEyebrow}>Full recipe details</p>
              <div className={styles.detailsTitleRow}>
                <h2 className={styles.detailsTitle}>{meal.strMeal}</h2>
                {meal.strYoutube ? (
                  <a
                    className={styles.videoTag}
                    href={meal.strYoutube}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Recipe video
                  </a>
                ) : null}
              </div>
            </div>

            {meal.strSource ? (
              <a
                className={styles.detailsLink}
                href={meal.strSource}
                rel="noreferrer"
                target="_blank"
              >
                Open source
              </a>
            ) : null}
          </div>
          <div className={styles.detailsLayout}>
            <div className={styles.detailsColumn}>
              <div className={styles.recipeFacts}>
                <p className={styles.recipeFact}>
                  <span className={styles.recipeLabel}>Category</span>
                  <span className={styles.recipeValue}>{meal.strCategory}</span>
                </p>
                <p className={styles.recipeFact}>
                  <span className={styles.recipeLabel}>Area</span>
                  <span className={styles.recipeValue}>{meal.strArea}</span>
                </p>
              </div>
              <section className={styles.ingredientsPanel}>
                <h3 className={styles.sectionTitle}>Ingredients</h3>
                <ul className={styles.ingredientsList}>
                  {ingredients.map((ingredient, index) => (
                    <li
                      className={styles.ingredientItem}
                      key={`${ingredient}-${index}`}
                    >
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className={styles.instructionsPanel}>
              <h3 className={styles.sectionTitle}>Instructions</h3>
              <div
                className={`${styles.instructionsBody} ${
                  instructionsExpanded ? styles.instructionsBodyExpanded : ""
                }`}
              >
                <p className={styles.instructionsText}>
                  {instructionsExpanded || !hasOverflow
                    ? meal.strInstructions
                    : instructionsPreview}
                </p>
                {hasOverflow ? (
                  <div className={styles.instructionsActions}>
                    <button
                      aria-label={
                        instructionsExpanded
                          ? "Collapse instructions"
                          : "Show full instructions"
                      }
                      className={styles.expandInstructionsBtn}
                      onClick={() =>
                        setExpandedMealId((currentMealId) =>
                          currentMealId === meal.idMeal ? null : meal.idMeal,
                        )
                      }
                      type="button"
                    >
                      {instructionsExpanded ? "Show less" : "Show more"}
                    </button>
                  </div>
                ) : null}
              </div>
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
              src={meal.strMealThumb}
              alt={meal.strMeal}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Homepage;
