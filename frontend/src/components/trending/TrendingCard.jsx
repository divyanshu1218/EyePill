import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { useState, useEffect } from "react";

const TrendingCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const allImages = [product.image, ...(product.additionalImages || [])];

  useEffect(() => {
    let intervalId;
    if (isHovering && allImages.length > 1) {
        intervalId = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }, 1200);
    } else {
        setCurrentImageIndex(0);
    }
    return () => clearInterval(intervalId);
  }, [isHovering, allImages.length]);

  return (
    <Link
      to={`/product/${product.id}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex flex-col h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
            <AiOutlinePlus />
         </div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col flex-grow pr-2">
          <h1 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {product.name}
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold mt-1">
            {product.brand}
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-xl font-black text-gray-900">₹{product.newPrice}</span>
          {product.price > product.newPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
      </div>

      <div className="relative flex justify-center items-center w-full py-2 h-48">
        {allImages.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`${product.name} preview ${index}`}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-bold uppercase tracking-tighter">
            {product.category}
        </span>
        <div className="flex items-center gap-1 text-yellow-400">
            <span className="text-xs font-bold text-gray-900">{product.rating || '4.5'}</span>
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
      </div>
    </Link>
  );
};

export default TrendingCard;
