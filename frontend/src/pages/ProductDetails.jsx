import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineShieldCheck } from "react-icons/hi";
import { BsBookmarkHeart, BsFillBookmarkHeartFill, BsTruck, BsArrowRepeat, BsShop } from "react-icons/bs";
import { IoChevronForwardOutline, IoChevronBackOutline, IoStar } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import {
  useAuthContext,
  useCartContext,
  useProductsContext,
  useWishlistContext,
} from "../contexts";
import { StarRating, TrendingCard } from "../components";
import { notify } from "../utils/utils";
import { getProductByIdService, postAddReviewService } from "../api/apiServices";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const { token } = useAuthContext();
  const { getProductById, allProducts, refreshProducts } = useProductsContext();
  const { addProductToCart, disableCart } = useCartContext();
  const { addProductToWishlist, deleteProductFromWishlist, disableWish } =
    useWishlistContext();

  const product = getProductById(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Dynamic data from product object
  const images = useMemo(() => {
    const imgs = [product?.image];
    if (product?.additionalImages && Array.isArray(product.additionalImages)) {
      imgs.push(...product.additionalImages);
    }
    return imgs.filter(img => img);
  }, [product]);

  const colors = product?.colors || [];
  const sizes = product?.sizes || [];
  const reviews = product?.reviews || [];

  const similarProducts = useMemo(() => {
    return allProducts
      .filter(p => p.category === product?.category && p.id !== product?.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      notify("warn", "Please Login to continue");
      return;
    }
    if (!newReview.comment.trim()) {
      notify("error", "Please add a comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await postAddReviewService(productId, newReview.rating, newReview.comment, token);
      if (response.data.success) {
        notify("success", "Review added successfully!");
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: "" });
        // Refresh global product state to show new review and updated rating
        await refreshProducts();
      }
    } catch (err) {
      console.error(err);
      notify("error", "Failed to add review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        await getProductByIdService(productId);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [productId]);

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2">
        <span>Home</span>
        <IoChevronForwardOutline className="mx-2 mt-1" />
        <span>{product.category}</span>
        <IoChevronForwardOutline className="mx-2 mt-1" />
        <span className="font-medium text-gray-900">{product.brand}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          <div className="flex-1 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group min-h-[400px] md:min-h-[500px] flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="max-h-full w-auto object-contain drop-shadow-2xl"
              />
            </AnimatePresence>
            
            {/* Gallery Navigation Overlay */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button 
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  className="p-2 rounded-full bg-white/80 shadow-lg pointer-events-auto hover:bg-white transition-colors"
                >
                  <IoChevronBackOutline size={24} />
                </button>
                <button 
                  onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  className="p-2 rounded-full bg-white/80 shadow-lg pointer-events-auto hover:bg-white transition-colors"
                >
                  <IoChevronForwardOutline size={24} />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 transition-all p-1 bg-white overflow-hidden ${
                  selectedImage === idx ? "border-blue-600 shadow-md" : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24 h-fit">
          <header className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
                <p className="text-lg text-blue-600 font-medium mt-1">{product.brand}</p>
              </div>
              <button 
                onClick={() => {
                  if (!token) {
                    navigate("/login", { state: { from: location.pathname } });
                    notify("warn", "Please Login to continue");
                  } else {
                    product.inWish ? deleteProductFromWishlist(product.id) : addProductToWishlist(product);
                  }
                }}
                disabled={disableWish}
                className="p-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                {product.inWish ? (
                  <BsFillBookmarkHeartFill className="text-2xl text-rose-600" />
                ) : (
                  <BsBookmarkHeart className="text-2xl text-gray-400 hover:text-rose-600" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                <StarRating product={product} />
                <span className="ml-2 font-bold text-green-700 text-sm">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">{reviews.length} Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-black text-gray-900">₹{product.newPrice}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
              <span className="text-lg font-bold text-green-600">
                ({Math.round(((product.price - product.newPrice) / product.price) * 100)}% OFF)
              </span>
            </div>
          </header>

          {/* Offer Banner */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start">
            <div className="bg-amber-200 p-2 rounded-lg">
              <MdOutlineLocalOffer className="text-amber-700 text-xl" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-sm">Limited Period Offer</p>
              <p className="text-amber-700 text-xs mt-1">Use code <span className="font-bold">EYEPILL20</span> for extra 20% discount on checkout.</p>
            </div>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Frame Color</h3>
              <div className="flex gap-4">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    title={typeof color === 'string' ? color : color.name}
                    className={`w-10 h-10 rounded-full border-2 p-1 transition-all border-transparent hover:border-gray-300`}
                  >
                    <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: typeof color === 'string' ? color.toLowerCase() : color.code }}></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Frame Size</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">Size Chart</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all border-gray-100 text-gray-600 hover:border-gray-300`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Check */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BsTruck className="text-lg" /> Delivery Check
            </h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />
              <button 
                onClick={() => setIsPincodeChecked(true)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Check
              </button>
            </div>
            {isPincodeChecked && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <HiOutlineShieldCheck /> Expected delivery by Wed, 12th May
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={disableCart}
              onClick={() => {
                if (!token) {
                  navigate("/login", { state: { from: location.pathname } });
                  notify("warn", "Please Login to continue");
                } else {
                  if (!product.inCart) {
                    addProductToCart(product);
                  } else {
                    navigate("/cart");
                  }
                }
              }}
              className="flex-1 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineShoppingBag className="text-2xl" />
              {product.inCart ? "Go to Bag" : "Add to Bag"}
            </button>
            <button
              onClick={() => {
                if (!token) {
                  navigate("/login", { state: { from: location.pathname } });
                  notify("warn", "Please Login to continue");
                } else {
                  if (!product.inCart) addProductToCart(product);
                  navigate("/cart");
                }
              }}
              className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="mt-16 border-t border-gray-100 pt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Specifications</p>
              <ul className="space-y-3 pt-4">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium">{product.gender}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium">{product.weight || "20g"}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description || "Designed for ultimate style and comfort. These high-quality frames feature a lightweight build and ergonomic design, making them perfect for all-day wear. The lenses provide 100% UV protection with enhanced clarity."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <BsArrowRepeat className="text-blue-600 text-xl" />
                  <span className="text-sm font-bold text-blue-900 text-center">7 Days Exchange</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <BsShop className="text-blue-600 text-xl" />
                  <span className="text-sm font-bold text-blue-900 text-center">In-Store Collection</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings & Reviews */}
        <section id="reviews">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h2>
              <p className="text-sm text-gray-500 mt-1">Verified customers shared their experience</p>
            </div>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="text-blue-600 font-bold hover:underline"
            >
              Write a Review
            </button>
          </div>
          
          {/* Review Form Modal */}
          <AnimatePresence>
            {showReviewForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
                    <button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600">
                      <IoChevronBackOutline size={24} className="rotate-90" />
                    </button>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="transition-transform active:scale-90"
                          >
                            <IoStar 
                              size={32} 
                              className={star <= newReview.rating ? "text-yellow-400" : "text-gray-200"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Your Experience</label>
                      <textarea
                        required
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="What did you like or dislike about this product?"
                        className="w-full h-32 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="flex-1 py-3 px-6 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Rating Summary */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-6xl font-black text-gray-900">{product.rating}</span>
                <div>
                  <div className="flex text-yellow-400 text-xl">
                    <StarRating product={product} />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Based on {reviews.length} reviews</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(star => {
                  const starCount = reviews.filter(r => r.rating === star).length;
                  const percentage = reviews.length ? (starCount / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4">{star} ★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8">{starCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="md:col-span-8 space-y-8">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex text-yellow-400 text-xs mb-1">
                        {new Array(review.rating).fill().map((_, i) => <IoStar key={i} />)}
                      </div>
                      <h4 className="font-bold text-gray-900">{review.comment.split('\n')[0]}</h4>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
                      {review.user?.firstName?.[0] || 'U'}{review.user?.lastName?.[0] || ''}
                    </div>
                    <span className="text-xs font-bold text-gray-900 italic text-center">
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous'}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Verified Buyer</span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 italic">No reviews yet for this product. Be the first to review!</p>
              )}
            </div>
          </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map(p => (
                <TrendingCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
