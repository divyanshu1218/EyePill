import { CiSearch } from "react-icons/ci";
import { filterBySearch } from "../../utils/filterUtils";
import { useProductsContext } from "../../contexts";
import { useEffect, useState } from "react";
import CartItemCard from "../cart/CartItemCard";
import { useLocation, useNavigate } from "react-router-dom";
import spinningLoaders from "../../assets/loaderBlack.svg";
const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { allProducts, applyFilters } = useProductsContext();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showList, setShowList] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (location?.pathname !== "/products") {
      setSearch("");
    }
  }, [location]);
  useEffect(() => {
    setSearching(true);
    let id;
    id = setTimeout(() => {
      setFilteredData(filterBySearch(search, allProducts));
      setSearching(false);
      if (location?.pathname === "/products" && !search) {
        applyFilters("searchText", search);
      }
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [search, allProducts, applyFilters, location?.pathname]);

  const changeHandler = (e) => {
    setSearch(e.target.value);
    if (!showList) setShowList(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    applyFilters("searchText", search);
    setShowList(false);
    navigate("/products");
  };

  return (
    <div className="relative w-full max-w-lg">
      <form
        onSubmit={submitHandler}
        className={`flex items-center bg-[#3f3f3f] px-4 py-1 ${search && showList ? "rounded-t-2xl" : "rounded-full"
          } text-sm transition text-white w-full`}
      >
        <CiSearch className="text-xl mr-2 text-gray-300" />
        <input
          className="w-full py-2 px-1 bg-transparent focus:outline-none text-white placeholder-gray-400"
          type="search"
          value={search}
          placeholder='Search "owndays lens"'
          onChange={changeHandler}
        />
      </form>
      {search && showList && (
        <ul className="absolute left-0 right-0 bg-[#3f3f3f] max-h-72 overflow-auto rounded-b-2xl z-50 shadow-2xl border-t border-gray-700 custom-scrollbar">
          {searching ? (
            <li className="h-10 flex items-center justify-center">
              <img src={spinningLoaders} alt="Searching..." className="invert" />
            </li>
          ) : filteredData.length ? (
            filteredData.map((product) => (
              <li key={product.id} className="">
                <CartItemCard
                  product={product}
                  isSearch={true}
                  setSearch={setSearch}
                />
              </li>
            ))
          ) : (
            <li className="h-10 flex items-center justify-center text-gray-400 text-sm italic">
              No items found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Search;
