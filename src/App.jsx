import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import WishlistPage from "./pages/WishlistPage";
import Profile from "./pages/Profile";
import MemoriesPage from "./pages/MemoriesPage";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

import { getCurrentUser, logout } from "./auth/auth";
import AppSidebar from "./components/AppSidebar";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ---------------------------
  // Load current user
  // ---------------------------
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (authLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return <Auth onLoginSuccess={setUser} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen w-full">
        {/* ---------------- Sidebar ---------------- */}
        <AppSidebar onLogout={handleLogout} />

        {/* ---------------- Content ---------------- */}
        <main className="flex-1 px-4 pb-20 overflow-y-auto max-h-screen">
          <Routes>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/memories" element={<MemoriesPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
