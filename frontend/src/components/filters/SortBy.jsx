import React from "react";
import { useProductsContext } from "../../contexts";

const SortBy = () => {
  const {
    applyFilters,
    filters: { sortBy },
  } = useProductsContext();
  return (
    <label className="relative">
      <select
        name="sortBy"
        value={sortBy}
        className="w-max py-2 px-4 rounded-xl cursor-pointer shadow-sm border border-gray-100 bg-white font-bold text-sm text-gray-900 focus:outline-none hover:bg-gray-50 transition-all appearance-none pr-10"
        onChange={(e) => applyFilters("sortBy", e.target.value)}
      >
        <option value="" defaultValue="" disabled>
          Sort By Price
        </option>
        <option value="low_to_high">
          Low to High
        </option>
        <option value="high_to_low">
          High to Low
        </option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </label>
  );
};

export default SortBy;
