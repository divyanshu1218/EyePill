import { motion } from "framer-motion";
import { useProductsContext } from "../../contexts";
import TrendingCard from "./TrendingCard";

const TrendingList = () => {
  const { trendingProducts } = useProductsContext();

  return (
    <section className="py-4 mt-10">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 tracking-tighter"
      >
        Trending Products
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
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {trendingProducts.map((product) => (
          <motion.div className="h-full" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} key={product.id}>
            <TrendingCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrendingList;
