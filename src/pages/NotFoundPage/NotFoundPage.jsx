import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <p className={styles.eyebrow}>Page not found</p>
        <h1 className={styles.title}>This recipe page has gone off the menu</h1>
        <p className={styles.description}>
          The page you are looking for does not exist or may have been moved.
          You can head back home or keep exploring recipes from the search page.
        </p>
      </div>
    </section>
  );
}

export default NotFoundPage;
