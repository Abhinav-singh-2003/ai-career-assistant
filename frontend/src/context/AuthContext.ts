import { createContext, useContext, useState, useEffect, type ReactNode, createElement } from "react";
import api from "../services/api";
import { type User, type AuthResponse } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);



  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    const { token, user } = response.data;
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };



  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
    await login(email, password);
  };



  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };


  return createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      },
    },
    children
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
