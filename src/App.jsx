import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";

import Home from "./pages/Home";
import WishlistPage from "./pages/WishlistPage";
import Profile from "./pages/Profile";
import MemoriesPage from "./pages/MemoriesPage";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

import AppSidebar from "./components/AppSidebar";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <Auth />; // reactively show login

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: fixed width, full height */}
      <div className="shrink-0">
        <AppSidebar className="h-screen fixed" />
      </div>

      {/* Main content: scrollable independently */}
      <div className="flex-1 px-6 pb-20 overflow-auto h-screen">
        <Routes>
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
