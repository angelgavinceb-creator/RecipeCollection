import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../api/client";
import type { RegisterInput } from "../types/user";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await request("/users/signin", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear cuenta</h1>
      <input
        name="username"
        placeholder="Nombre de usuario"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Registrarme</button>
      {error && <p>{error}</p>}
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}