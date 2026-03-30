import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { storage } from "../utils/storage";

type User = {
  id: string;
  role: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => storage.getItem<User>("user"));
  const [token, setToken] = useState<string | null>(() => storage.getItem<string>("auth_token"));

  const login = (newToken: string, newUser: User) => {
    storage.setItem("auth_token", newToken);
    storage.setItem("user", newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    storage.removeItem("auth_token");
    storage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
