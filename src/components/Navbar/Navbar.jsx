import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <NavLink className={linkClass} end to="/">
          Home
        </NavLink>
        <NavLink className={linkClass} to="/search">
          Search Page
        </NavLink>
        <NavLink className={linkClass} to="/favorites">
          Favorites Page
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
