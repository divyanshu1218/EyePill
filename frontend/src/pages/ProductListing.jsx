import { BiFilter } from "react-icons/bi";
import { MdKeyboardArrowUp } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import bannerImg from "../assets/bannerHero.jpg";
import loadingGif from "../assets/loading.gif";

import { Filters, SingleProduct, SortBy } from "../components";

import { useProductsContext } from "../contexts";
import { useEffect, useState } from "react";
import { useFilter } from "../hooks/filtersHook";
import { useLocation } from "react-router";

const ITEMS_PER_PAGE = 12;

const ProductListing = () => {
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading } = useProductsContext();
  const allFilteredProducts = useFilter();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [allFilteredProducts.length]);

  // Paginate
  const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const productsList = allFilteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (location?.state?.from === "category") {
      setIsFilterOpen(true);
    }
  }, [location?.state?.from]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const toggleShowArrow = () => {
      if (window.scrollY > 300) {
        setShowScrollArrow(true);
      } else {
        setShowScrollArrow(false);
      }
    };
    window.addEventListener("scroll", toggleShowArrow);

    return () => {
      window.removeEventListener("scroll", toggleShowArrow);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Shop Eyewear | EyePill</title>
        <meta name="description" content="Browse our collection of premium sunglasses, optical glasses, and sports eyewear. Filter by category, price, and rating." />
      </Helmet>
      {loading ? (
        <div className="h-[70vh] w-full flex items-center justify-center overflow-hidden ">
          <span>
            <img width={250} src={loadingGif} alt="loading..." />
          </span>
        </div>
      ) : (
        <div>
          <header className="mb-3">
            <img
              src={bannerImg}
              alt="bannerImg"
              className="rounded-md h-full min-h-[10rem] object-cover"
            />
          </header>
          <section className="py-3 flex flex-col md:flex-row gap-2 justify-between">
            <h1 className="text-2xl font-bold">
              Glasses for You!
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({allFilteredProducts.length} products)
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <Filters
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
              />
              <SortBy />
              <button
                className={`flex py-2 px-4 rounded-xl shadow-sm border border-gray-100 items-center gap-2 hover:bg-gray-50 transition-all font-bold ${
                  isFilterOpen ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900"
                }`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <BiFilter className="text-xl" />
                <span className="text-sm tracking-tight">Filters</span>
              </button>
            </div>
          </section>

          {productsList.length > 0 ? (
            <>
              <main className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {productsList.map((glass) => (
                  <SingleProduct key={glass.id} product={glass} />
                ))}
              </main>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-10">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                        page === currentPage
                          ? "bg-gray-900 text-white shadow-lg"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="font-sans text-4xl  font-bold uppercase  tracking-wide text-gray-300 text-center w-full py-32">
              Nothing to Show!
            </p>
          )}
          <button
            className={` fixed bottom-10 bg-gray-800 right-2 p-2 rounded-full text-xl shadow-2xl transition-all delay-100 ease-in-out ${showScrollArrow ? "block" : "hidden"
              }`}
            onClick={scrollToTop}
          >
            <MdKeyboardArrowUp className=" text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default ProductListing;
