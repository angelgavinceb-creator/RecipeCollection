import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
    const { user, logout } = useAuth();
  return (
    <>
      <header>
        <nav>
            <span>
                {user ? 
                    <span>
                        <button onClick={logout}>Cerrar sesión</button>
                        <Link to="/myProfile">Mi perfil</Link>
                        <Link to="/">Inicio</Link>
                        <Link to="/favorites">Favoritos</Link>
                        <Link to="/createRecipe">Crear receta</Link>
                    </span>  
                : <Link to="/login">Login</Link>}
            </span>
        </nav>
      </header>

      <main>
        <Outlet /> {}
      </main>
    </>
  );
}