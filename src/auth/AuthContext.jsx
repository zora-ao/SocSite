import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout as authLogout, login as authLogin } from "./auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Optional logout on tab/browser close
  useEffect(() => {
    const handleUnload = () => {
      authLogout(); // best-effort logout
      setUser(null);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Logout function
  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  // Login function
  const login = async (email, password) => {
    await authLogin(email, password); // call auth.js login
    const u = await getCurrentUser();  // get updated user info
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
