import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts";
import { AiOutlineUser, AiOutlineShopping, AiOutlineLogout } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const ProfileDropdown = ({ isOpen, setIsOpen }) => {
  const { userInfo, logoutHandler } = useAuthContext();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutHandler();
    setIsOpen(false);
  };

  if (!userInfo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute top-10 right-0 pt-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden origin-top-right relative"
          >
            {/* Invisible bridge to prevent closing on gap hover */}
            <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />

          {/* Header */}
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center text-xl font-bold shadow-md">
              {userInfo?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg leading-tight">
                {userInfo?.username}
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {userInfo?.role || "User"}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation("/orders")}
              className="w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <AiOutlineShopping className="text-xl" />
              My Orders
            </button>
            <button
              onClick={() => handleNavigation("/profile")}
              className="w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <AiOutlineUser className="text-xl" />
              Account Information
            </button>
          </div>

          {/* Footer / Logout */}
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <AiOutlineLogout className="text-xl" />
              Logout
            </button>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
