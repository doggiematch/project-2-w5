import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import ReceiptDetailPage from "./pages/ReceiptDetailPage/ReceiptDetailPage";
import FavoritePage from "./pages/FavoritesPage/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/receipt/:id" element={<ReceiptDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;