import { motion } from "framer-motion";
import { useProductsContext } from "../../contexts";
import CategoryCard from "./CategoryCard";

const CategoryList = ({ catRef }) => {
  const { categoryList } = useProductsContext();
  
  return (
    <section className="py-12" ref={catRef}>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-center"
      >
        Shop by Category
      </motion.h1>
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {categoryList.map((categoryItem) => (
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} key={categoryItem.id}>
            <CategoryCard category={categoryItem} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategoryList;
