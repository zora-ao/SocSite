import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  logout as authLogout,
  login as authLogin,
  signup as authSignup,
} from "./auth";

import { databases, ID } from "../lib/appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_PROFILES_COLLECTION_ID,
} from "../config/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Auto logout after 30 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await authLogout();
        setUser(null);
      }, 30 * 60 * 1000); // 30 mins
    };

    // Listen to user activity
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    window.addEventListener("click", resetTimeout);
    window.addEventListener("scroll", resetTimeout);

    // Start timer
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("click", resetTimeout);
      window.removeEventListener("scroll", resetTimeout);
    };
  }, [user]);

  // Signup (NEW – with birthday)
  const signup = async (email, password, username, birthday) => {
    // Create auth account
    const newUser = await authSignup(email, password, username);

    // Create profile document
    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID,
      ID.unique(),
      {
        userId: newUser.$id,
        username,
        birthday, // YYYY-MM-DD
        createdAt: new Date().toISOString(),
      }
    );

    setUser(newUser); // set the user after signup
    return newUser;
  };

  // Login
  const login = async (email, password) => {
    await authLogin(email, password);
    const u = await getCurrentUser();
    setUser(u);
  };

  // Logout
  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signup,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
