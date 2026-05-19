import { BsArrowDownRightCircle } from "react-icons/bs";
import { motion } from "framer-motion";

import bannerImg from "../../assets/bannerImg.png";
import { useNavigate } from "react-router";

const Banner = ({ catRef }) => {
  const navigate = useNavigate();

  return (
    <main className="flex justify-between items-center py-1 mb-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-[20%] w-64 h-64 border border-blue-100 rounded-full opacity-20"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: -360
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-[40%] w-32 h-32 border-2 border-dashed border-gray-200 rounded-full opacity-10"
        />
      </div>

      <section className="max-w-4xl mx-auto sm:mx-0 w-full py-2 lg:w-[60%] z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-6"
        >
          New Collection 2026
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl sm:text-8xl lg:text-9xl font-black py-4 w-full tracking-[-0.05em] leading-[0.85] text-gray-900"
        >
          Glasses <br/> & Lens
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="py-6 text-xl text-gray-500 max-w-lg leading-relaxed"
        >
          Buy the best high-quality sunglasses from us.
          <br />
          More than 100 types of assortment.
        </motion.p>
        
        {/* Stats Row to fill space */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-12 py-8"
        >
          <div>
            <p className="text-4xl font-black text-gray-900">10k+</p>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Happy Customers</p>
          </div>
          <div className="w-px h-12 bg-gray-200 my-auto"></div>
          <div>
            <p className="text-4xl font-black text-gray-900">4.9/5</p>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Average Rating</p>
          </div>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-4 mt-4"
        >
          <button
            className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-gray-900/20"
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
            <span className="mx-2 text-lg group-hover:underline text-gray-900 font-bold">Explore More</span>{" "}
            <BsArrowDownRightCircle className="text-2xl transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
          </button>
        </motion.section>
      </section>

      <motion.section 
        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden w-[40%] lg:flex justify-end relative"
      >
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-[120px] opacity-30 -z-10 animate-pulse"></div>
        <img src={bannerImg} alt="bannerImg" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]" />
      </motion.section>
    </main>
  );
};

export default Banner;
