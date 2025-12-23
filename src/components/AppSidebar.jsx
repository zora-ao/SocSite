import { Link, useLocation } from "react-router-dom";
import { Home, Heart, User, Image, Settings as SettingsIcon } from "lucide-react";

export default function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { label: "Home", path: "/home", icon: <Home /> },
    { label: "Wishlist", path: "/wishlist", icon: <Heart /> },
    { label: "Memories", path: "/memories", icon: <Image /> },
    { label: "Profile", path: "/profile", icon: <User /> },
  ];

  return (
    <>
      {/* ---------------- Desktop Sidebar ---------------- */}
      <div className="hidden md:flex md:flex-col md:w-48 md:h-screen md:border-r md:bg-white">
        <div className="flex-1 p-4">
          <h2 className="font-bold text-lg mb-4">Navigation</h2>
          <nav className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link key={link.path} to={link.path}>
                <button
                  className={`flex items-center gap-2 w-full p-2 rounded ${
                    currentPath === link.path
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <Link to="/settings">
            <button
              className={`flex items-center gap-2 w-full p-2 rounded ${
                currentPath === "/settings"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <SettingsIcon />
              Settings
            </button>
          </Link>
        </div>
      </div>

      {/* ---------------- Mobile Bottom Navigation ---------------- */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-inner flex justify-around py-2 z-50">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex flex-col items-center justify-center text-xs"
          >
            <div
              className={`${
                currentPath === link.path ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {link.icon}
            </div>
            <span
              className={`${
                currentPath === link.path ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}

        {/* Settings */}
        <Link to="/settings" className="flex flex-col items-center justify-center text-xs">
          <div
            className={`${
              currentPath === "/settings" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <SettingsIcon />
          </div>
          <span
            className={`${
              currentPath === "/settings" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Settings
          </span>
        </Link>
      </div>

      {/* Add bottom padding for mobile so content is not hidden behind nav */}
      <div className="md:hidden pb-16"></div>
    </>
  );
}
