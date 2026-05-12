import React from "react";
import { useProductsContext } from "../../contexts";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const CategoryCard = ({
  category: { categoryName, description, categoryImg },
}) => {
  const navigate = useNavigate();
  const { applyFilters } = useProductsContext();

  const clickHandler = () => {
    applyFilters("categories", [categoryName]);
    navigate("/products", { state: { from: "category" } });
  };
  return (
    <motion.section
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center rounded-2xl bg-black/[.06] cursor-pointer gap-3 relative overflow-hidden aspect-square shadow-sm hover:shadow-2xl transition-shadow group"
      onClick={clickHandler}
    >
      <img
        src={categoryImg}
        alt={categoryName}
        className="rounded-xl h-full w-full object-cover transition-all delay-75 ease-out group-hover:scale-110"
      />
      <div className="flex flex-col w-full h-full justify-center items-center transition-all delay-75 absolute left-0 right-0 bottom-0 top-0 bg-black/[0.4] group-hover:bg-black/[0.2] rounded-xl">
        <h1 className="text-4xl xs:text-6xl sm:text-8xl lg:text-4xl font-black capitalize text-white drop-shadow-lg p-3 break-all text-center tracking-tighter">
          {categoryName}
        </h1>
      </div>
    </motion.section>
  );
};

export default CategoryCard;
