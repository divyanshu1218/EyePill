import { BsArrowDownRightCircle } from "react-icons/bs";
import { motion } from "framer-motion";

import bannerImg from "../../assets/bannerImg.png";
import { useNavigate } from "react-router";

const Banner = ({ catRef }) => {
  const navigate = useNavigate();

  return (
    <main className="flex justify-between items-center py-1 mb-5 relative overflow-hidden">
      <section className="max-w-xl mx-auto sm:mx-0 w-full py-2 lg:w-1/3">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl sm:text-7xl lg:text-8xl font-black py-3 w-full tracking-tighter leading-none text-gray-900"
        >
          Glasses <br/> & Lens
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="py-3 text-md text-gray-600"
        >
          Buy the best high-quality sunglasses from us.
          <br />
          More than 100 types of assortment.
        </motion.p>
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center"
        >
          <button
            className="btn-primary text-sm md:text-base hover:scale-105 transition-transform"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
          <button
            className="p-3 flex items-center group"
            onClick={() =>
              catRef.current.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <span className="mx-2 text-sm md:text-base group-hover:underline">Explore More</span>{" "}
            <BsArrowDownRightCircle className="text-lg transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
          </button>
        </motion.section>
      </section>
      <motion.section 
        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden w-1/2 lg:flex justify-end relative"
      >
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
        <img src={bannerImg} alt="bannerImg" className="w-2/3 h-auto drop-shadow-2xl" />
      </motion.section>
    </main>
  );
};

export default Banner;
