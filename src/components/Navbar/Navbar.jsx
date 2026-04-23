import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home | </Link>
      <Link to="/search">Search Page | </Link>
      <Link to="/favorites">Favorites Page</Link>
    </nav>
  );
}

export default Navbar;
