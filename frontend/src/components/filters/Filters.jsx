import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "./Checkbox";
import InputRange from "./InputRange";
import InputRadio from "./InputRadio";
import InputRadioType2 from "./InputRadioType2";
import { useProductsContext } from "../../contexts";
import {
  checkboxCategories,
  gendersList,
  ratings,
} from "../../utils/constants";

const FilterHeading = ({ text }) => <h2 className="text-lg font-bold mb-4 text-gray-800 uppercase tracking-widest">{text}</h2>;

const Filters = ({ isFilterOpen, setIsFilterOpen }) => {
  const { clearFilters, applyFilters, filters } = useProductsContext();

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-[320px] bg-white z-[101] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Filters</h1>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AiOutlineClose className="text-xl text-gray-500" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 font-medium italic">Refine your search</span>
                <button
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              <section>
                <FilterHeading text="Gender" />
                <div className="grid grid-cols-2 gap-3">
                  {gendersList.map((data, index) => (
                    <InputRadioType2 data={data} key={index} />
                  ))}
                </div>
              </section>

              <section>
                <FilterHeading text="Price Range" />
                <div className="px-2">
                   <InputRange />
                </div>
              </section>

              <section>
                <FilterHeading text="Categories" />
                <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl">
                  {checkboxCategories.map((data, index) => (
                    <Checkbox data={data} key={index} />
                  ))}
                </div>
              </section>

              <section>
                <FilterHeading text="Availability" />
                <label className="flex items-center justify-between bg-gray-50 p-4 rounded-xl cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={filters.inStockOnly || false}
                      onChange={(e) => applyFilters("inStockOnly", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </section>

              <section className="pb-10">
                <FilterHeading text="Rating" />
                <div className="flex flex-col gap-3">
                  {ratings.map((data, index) => (
                    <InputRadio data={data} key={index} name="rating" />
                  ))}
                </div>
              </section>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg active:scale-[0.98]"
               >
                 Show Results
               </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Filters;
