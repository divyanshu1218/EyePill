import React from "react";
import { Helmet } from "react-helmet-async";
import SingleProduct from "../components/products/SingleProduct";
import { useAuthContext, useCartContext, useProductsContext, useWishlistContext } from "../contexts";
import emptyWish from "../assets/empty-wish.gif";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { notify } from "../utils/utils";

const Wishlist = () => {
  const { wishlist, deleteProductFromWishlist, disableWish } = useWishlistContext();
  const { addProductToCart, disableCart } = useCartContext();
  const { isInCart } = useProductsContext();

  const handleMoveToCart = (product) => {
    if (!isInCart(product.id)) {
      addProductToCart(product);
    }
    deleteProductFromWishlist(product.id);
    notify("success", "Moved to Bag!");
  };

  return (
    <div>
      <Helmet><title>My Wishlist | EyePill</title></Helmet>
      {wishlist.length ? (
        <>
          <h1 className="text-2xl py-6 font-semibold text-gray-800">
            Wishlist ({wishlist.length})
          </h1>
          <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((glass) => (
              <div key={glass.id} className="flex flex-col">
                <SingleProduct product={glass} fromWish={true} />
                <button
                  disabled={disableCart || disableWish}
                  onClick={() => handleMoveToCart(glass)}
                  className="mt-2 py-2.5 px-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineShoppingBag className="text-lg" />
                  {isInCart(glass.id) ? "Already in Bag" : "Move to Bag"}
                </button>
              </div>
            ))}
          </main>
        </>
      ) : (
        <div className="h-[65vh] w-full flex flex-col items-center justify-center pt-3">
          <img
            src={emptyWish}
            alt="empty-wishlist"
            className="w-full xs:w-1/2 sm:w-1/3"
          />
          <span className="font-sans text-xl font-bold uppercase tracking-wide text-gray-300">
            Nothing to Show!
          </span>
          <p className="text-gray-400">
            Unlock Your Shopping Desires: Fill Your Empty Wishlist
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
