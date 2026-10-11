import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

function App() {
 return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/myProfile" element={<ProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/createRecipe" element={<CreateRecipePage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;