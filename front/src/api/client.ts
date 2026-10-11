const API_URL = import.meta.env.VITE_API_URL;

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Sesión caducada o token inválido: limpiamos y mandamos al login.
  // Excluimos /users/login porque ahí un 401 significa "credenciales incorrectas".
  if (response.status === 401 && token && path !== "/users/login") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Sesión caducada");
  }

  // Leemos como texto primero: algunas respuestas pueden venir vacías
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.text ?? "Error en la petición");
  }

  return data as T;
}