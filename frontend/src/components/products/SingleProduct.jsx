import { GiRoundStar } from "react-icons/gi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  useAuthContext,
  useCartContext,
  useProductsContext,
  useWishlistContext,
} from "../../contexts";
import { useLocation, useNavigate } from "react-router";
import { notify } from "../../utils/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SingleProduct = ({ product }) => {
  const { token } = useAuthContext();
  const { isInCart } = useProductsContext();
  const { addProductToCart, disableCart } = useCartContext();
  const { addProductToWishlist, deleteProductFromWishlist, disableWish } =
    useWishlistContext();
  const navigate = useNavigate();
  const location = useLocation();
  let inCart = isInCart(product.id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const allImages = [product.image, ...(product.additionalImages || [])];

  useEffect(() => {
    let intervalId;
    if (isHovering && allImages.length > 1) {
        intervalId = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }, 1200); // cycle every 1.2s
    } else {
        setCurrentImageIndex(0); // reset when not hovering
    }
    return () => clearInterval(intervalId);
  }, [isHovering, allImages.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer group hover:shadow-xl transition-all duration-300"
    >
      <div
        className="relative aspect-[4/3] bg-gray-50 flex items-center justify-center p-8 overflow-hidden"
        onClick={() => {
          navigate(`/product/${product.id}`);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {allImages.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`${product.name} preview ${index}`}
            className={`absolute inset-0 w-full h-full object-contain p-8 transition-all duration-500 group-hover:scale-110 ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        
        <button
          disabled={disableWish}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-20"
          onClick={(e) => {
            e.stopPropagation();
            if (!token) {
              navigate("/login", { state: { from: location.pathname } });
              notify("warn", "Please Login to continue");
            } else {
              if (product?.inWish) {
                deleteProductFromWishlist(product.id);
              } else {
                addProductToWishlist(product);
              }
            }
          }}
        >
          {product.inWish ? (
            <AiFillHeart className="text-xl text-rose-600" />
          ) : (
            <AiOutlineHeart className="text-xl text-gray-400 hover:text-rose-600 transition-colors" />
          )}
        </button>

        <div className="absolute bottom-4 left-4 z-20">
           <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
                {product.rating} <GiRoundStar className="text-yellow-400" />
           </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate w-40">
                    {product.name}
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{product.brand}</p>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-lg font-black text-gray-900">₹{product.newPrice}</span>
                {product.price > product.newPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                )}
            </div>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <button
            className={`flex-grow py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                inCart 
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200 hover:shadow-gray-300"
            }`}
            disabled={disableCart}
            onClick={(e) => {
              e.stopPropagation();
              if (!token) {
                navigate("/login", { state: { from: location.pathname } });
                notify("warn", "Please Login to continue");
              } else {
                if (!inCart) {
                  addProductToCart(product);
                } else {
                  navigate("/cart");
                }
              }
            }}
          >
            {inCart ? "In Bag" : "Add to Bag"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleProduct;
