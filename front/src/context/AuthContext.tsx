import { createContext, useContext, useState, type ReactNode } from "react";
import { request } from "../api/client";
import type { User, LoginInput } from "../types/user";

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): User | null {
  const stored = localStorage.getItem("user");
  return stored ? (JSON.parse(stored) as User) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser);

  async function login(input: LoginInput) {
    const data = await request<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}