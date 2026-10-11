import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createRecipe } from "../api/recipes";
import { getIngredients } from "../api/ingredients";
import type { IngredientOption } from "../types/ingredient";
import type { Difficulty } from "../types/recipe";
 
const UNITS = [
  "Gramos",
  "Kilos",
  "Mililitros",
  "Litros",
  "Unidades",
  "Cucharadas",
  "Cucharaditas",
  "Pizca",
];
 
interface IngredientRow {
  key: number; // solo para que React identifique cada fila al añadir/quitar
  name: string;
  quantity: string;
  unit: string;
}
 
export default function CreateRecipePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    title: "",
    description: "",
    prepTime: "",
    servings: "",
    difficulty: "1",
  });
  const nextKey = useRef(1);
  const [rows, setRows] = useState<IngredientRow[]>([
    { key: 0, name: "", quantity: "", unit: UNITS[0] },
  ]);
  const [availableIngredients, setAvailableIngredients] = useState<IngredientOption[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
 
  useEffect(() => {
    getIngredients()
      .then(setAvailableIngredients)
      .catch(() => setError("No se pudieron cargar los ingredientes"));
  }, []);
 
  if (!user) return <Navigate to="/login" replace />;
 
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
 
  function handleRowChange(key: number, field: "name" | "quantity" | "unit", value: string) {
    setRows(rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  }
 
  function addRow() {
    setRows([...rows, { key: nextKey.current++, name: "", quantity: "", unit: UNITS[0] }]);
  }
 
  function removeRow(key: number) {
    setRows(rows.filter((row) => row.key !== key));
  }
 
  function validate(): string {
    const title = form.title.trim();
    if (!title) return "El título es obligatorio";
    if (title.length > 50) return "El título no puede superar los 50 caracteres";
 
    const prepTime = Number(form.prepTime);
    if (!Number.isInteger(prepTime) || prepTime < 1) {
      return "El tiempo de preparación debe ser un número entero mayor que 0";
    }
 
    const servings = Number(form.servings);
    if (!Number.isInteger(servings) || servings < 1) {
      return "Las raciones deben ser un número entero mayor que 0";
    }
 
    if (rows.length === 0) return "Añade al menos un ingrediente";
 
    for (const row of rows) {
      if (!row.name) return "Elige un ingrediente en todas las filas";
      const quantity = Number(row.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return `La cantidad de "${row.name}" debe ser un número mayor que 0`;
      }
    }
 
    // La tabla recipes_ingredients tiene clave primaria (recipe_id, ingredient_id)
    if (new Set(rows.map((row) => row.name)).size !== rows.length) {
      return "Hay ingredientes repetidos";
    }
 
    return "";
  }
 
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
 
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
 
    try {
      setSending(true);
      await createRecipe({
        title: form.title.trim(),
        description: form.description.trim(),
        prepTime: Number(form.prepTime),
        servings: Number(form.servings),
        difficulty: Number(form.difficulty) as Difficulty,
        ingredients: rows.map((row) => ({
          name: row.name,
          quantity: Number(row.quantity),
          unit: row.unit,
        })),
      });
      navigate("/myProfile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la receta");
    } finally {
      setSending(false);
    }
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear receta</h1>
 
      <div>
        <input
          name="title"
          placeholder="Título"
          maxLength={50}
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
 
      <div>
        <textarea
          name="description"
          placeholder="Descripción / pasos"
          value={form.description}
          onChange={handleChange}
        />
      </div>
 
      <div>
        <label>
          Tiempo de preparación (min):{" "}
          <input
            name="prepTime"
            type="number"
            min={1}
            step={1}
            value={form.prepTime}
            onChange={handleChange}
            required
          />
        </label>
      </div>
 
      <div>
        <label>
          Raciones:{" "}
          <input
            name="servings"
            type="number"
            min={1}
            step={1}
            value={form.servings}
            onChange={handleChange}
            required
          />
        </label>
      </div>
 
      <div>
        <label>
          Dificultad:{" "}
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option value="1">Fácil</option>
            <option value="2">Media</option>
            <option value="3">Difícil</option>
          </select>
        </label>
      </div>
 
      <h2>Ingredientes</h2>
      {rows.map((row) => (
        <div key={row.key}>
          <select
            value={row.name}
            onChange={(e) => handleRowChange(row.key, "name", e.target.value)}
            required
          >
            <option value="">Elige un ingrediente</option>
            {availableIngredients
              // no ofrecer los que ya están elegidos en otras filas
              .filter(
                (ing) =>
                  ing.name === row.name ||
                  !rows.some((other) => other.key !== row.key && other.name === ing.name)
              )
              .map((ing) => (
                <option key={ing.id} value={ing.name}>
                  {ing.name}
                </option>
              ))}
          </select>
 
          <input
            type="number"
            min={0.01}
            step="any"
            placeholder="Cantidad"
            value={row.quantity}
            onChange={(e) => handleRowChange(row.key, "quantity", e.target.value)}
            required
          />
 
          <select
            value={row.unit}
            onChange={(e) => handleRowChange(row.key, "unit", e.target.value)}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
 
          <button type="button" onClick={() => removeRow(row.key)} disabled={rows.length === 1}>
            Quitar
          </button>
        </div>
      ))}
 
      <button type="button" onClick={addRow}>
        Añadir ingrediente
      </button>
 
      <div>
        <button type="submit" disabled={sending}>
          {sending ? "Creando..." : "Crear receta"}
        </button>
      </div>
 
      {error && <p>{error}</p>}
    </form>
  );
}