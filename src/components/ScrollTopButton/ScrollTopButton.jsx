import styles from "./ScrollTopButton.module.css";

function ScrollTopButton() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      aria-label="Back to top"
      className={styles.button}
      onClick={handleScrollTop}
      type="button"
    >
      Top
    </button>
  );
}

export default ScrollTopButton;
