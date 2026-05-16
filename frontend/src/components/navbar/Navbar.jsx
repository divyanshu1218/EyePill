import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { MdOutlineExplore } from "react-icons/md";

import { RxHamburgerMenu } from "react-icons/rx";
import defaultUser from "../../assets/defaultUser.png";
import MenuDropdown from "./MenuDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Logo from "./Logo";
import {
  useAuthContext,
  useCartContext,
  useWishlistContext,
} from "../../contexts";

import Search from "../filters/Search";

const Navbar = () => {
  const { token, userInfo } = useAuthContext();
  const { cart } = useCartContext();
  const { wishlist } = useWishlistContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", changeNavbarColor);

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  return (
    <nav
      className={`flex flex-col sm:flex-row py-4 fixed top-0 left-0 right-0 px-[2%] md:px-[4%] transition-all duration-300 z-[100] ${
        colorChange 
        ? "bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-100" 
        : "bg-[--theme-color]"
      }`}
    >
      <div className="flex justify-between w-full items-center gap-4">
        <section className="flex items-center flex-shrink-0">
          <Logo />
        </section>

        <div className="flex-grow max-w-xl">
          <Search />
        </div>

        <section className="flex items-center gap-4">
          {userInfo?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-3 py-1 shadow-sm rounded-md text-white bg-blue-700 text-sm hover:bg-blue-800 transition"
            >
              Admin
            </Link>
          )}

          <ul className="flex items-center gap-4 text-2xl">
            <li
              className="relative cursor-pointer transition hover:text-rose-600"
              onClick={() => navigate("/wishlist")}
            >
              <AiOutlineHeart />
              {token && wishlist.length > 0 && (
                <div className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-[--theme-color]">
                  {wishlist.length}
                </div>
              )}
            </li>
            <li
              className="relative cursor-pointer transition hover:text-yellow-600"
              onClick={() => navigate("/cart")}
            >
              <HiOutlineShoppingBag />
              {token && cart.length > 0 && (
                <div className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-[--theme-color]">
                  {cart.length}
                </div>
              )}
            </li>
            <li
              className="relative cursor-pointer"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div 
                className="w-9 h-9 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#4338ca] border border-blue-200 hover:bg-blue-300 transition"
                onClick={() => {
                  if (!token) navigate("/login");
                }}
              >
                {token && userInfo ? (
                  <span className="font-bold text-sm">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <HiOutlineUser className="text-xl" />
                )}
              </div>
              {token && <ProfileDropdown isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />}
            </li>
          </ul>

          <section className="md:hidden cursor-pointer">
            <RxHamburgerMenu
              className="text-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && <MenuDropdown navigate={navigate} />}
          </section>
        </section>
      </div>

    </nav>
  );
};

export default Navbar;
