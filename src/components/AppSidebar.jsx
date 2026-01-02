import { Link, useLocation } from "react-router-dom";
import { Home, Heart, User, Image, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Wishlist", path: "/wishlist", icon: Heart },
    { label: "Memories", path: "/memories", icon: Image },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <>
      {/* ---------------- Desktop Sidebar ---------------- */}
      <div className="hidden md:flex md:flex-col md:w-48 md:h-screen md:border-r bg-[#E6D8C3]">
        <div className="flex-1 py-4 px-2">
          <h2 className="font-bold text-xl text-center mb-4 pacifico">Rant Site</h2>

          <nav className="flex flex-col space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;

              return (
                <Link key={link.path} to={link.path}>
                  <motion.button
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex inter items-center gap-2 w-full p-2 rounded transition-colors
                      ${
                        isActive
                          ? "bg-[#5D866C] text-white"
                          : "hover:bg-white"
                      }`}
                  >
                    <Icon />
                    {link.label}
                  </motion.button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="py-4 px-2">
          <Link to="/settings">
            <motion.button
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 w-full p-2 rounded
                ${
                  currentPath === "/settings"
                    ? "bg-[#5D866C] text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              <SettingsIcon />
              Settings
            </motion.button>
          </Link>
        </div>
      </div>

      {/* ---------------- Mobile Bottom Navigation ---------------- */}
      <div className="fixed inter bottom-0 left-0 right-0 md:hidden bg-[#E6D8C3] border-t shadow-inner z-50">
        <div className="relative flex justify-around py-2">
          {/* Sliding Active Indicator */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-1 h-1 w-12 bg-orange-800 rounded-full"
            style={{
              left: `${
                [...links.map((l) => l.path), "/settings"].indexOf(currentPath) *
                1 +
                1
              }%`,
            }}
          />

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={triggerHaptic}
                className="flex-1"
              >
                <motion.div
                  className="flex flex-col items-center justify-center text-xs"
                  animate={{
                    y: isActive ? -6 : 0,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon
                    className={isActive ? "text-[]" : "text-black"}
                  />
                  <span
                    className={`${
                      isActive ? "text-black font-medium" : "text-black"
                    }`}
                  >
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* Settings */}
          <Link to="/settings" onClick={triggerHaptic} className="flex-1">
            <motion.div
              className="flex flex-col items-center justify-center text-xs"
              animate={{
                y: currentPath === "/settings" ? -6 : 0,
                scale: currentPath === "/settings" ? 1.15 : 1,
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <SettingsIcon
                className={
                  currentPath === "/settings"
                    ? "text-black"
                    : "text-black"
                }
              />
              <span
                className={`${
                  currentPath === "/settings"
                    ? "text-black font-medium"
                    : "text-black"
                }`}
              >
                Settings
              </span>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="md:hidden pb-16" />
    </>
  );
}
