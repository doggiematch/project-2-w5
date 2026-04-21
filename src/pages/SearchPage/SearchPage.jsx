import { useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // console.log("Buscar:", query);
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};

  return (
    <div>
      <h1>Search</h1>

      <input
        type="text"
        placeholder="Escribe un ingrediente"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchPage;