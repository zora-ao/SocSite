import { useEffect, useState } from "react";
import Home from "./pages/Home";
import WishlistPage from "./pages/WishlistPage";
import Profile from "./pages/Profile";
import MemoriesPage from "./pages/MemoriesPage";
import Auth from "./pages/Auth";

import { getCurrentUser, logout } from "./auth/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCurrentPage("home");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Auth onLoginSuccess={setUser} />;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />

        <SidebarInset className="p-6">
          {currentPage === "home" && <Home user={user} />}
          {currentPage === "wishlist" && <WishlistPage />}
          {currentPage === "memories" && <MemoriesPage />}
          {currentPage === "profile" && <Profile />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
