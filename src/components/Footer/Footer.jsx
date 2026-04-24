import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>
        &copy; {currentYear} What&apos;s in my fridge? Data provided by{" "}
        <a
          className={styles.link}
          href="https://www.themealdb.com/"
          rel="noreferrer"
          target="_blank"
        >
          TheMealDB
        </a>
      </p>
    </footer>
  );
}

export default Footer;
