import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { BsLightning, BsStars, BsGift } from "react-icons/bs";

const deals = [
  {
    icon: <BsLightning className="text-3xl" />,
    title: "Flash Sale",
    description: "Up to 60% off on selected sunglasses",
    badge: "Limited Time",
    gradient: "from-orange-500 to-rose-500",
    bgGlow: "bg-orange-500/20",
  },
  {
    icon: <BsStars className="text-3xl" />,
    title: "New Arrivals",
    description: "Fresh styles just landed — be the first to own them",
    badge: "Just In",
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/20",
  },
  {
    icon: <BsGift className="text-3xl" />,
    title: "Bundle & Save",
    description: "Buy 2 get 1 free on all optical lenses",
    badge: "Best Value",
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/20",
  },
];

const Deals = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-[4%] md:px-[10%]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Special Offers
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Deals You Can't Miss
        </h2>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto">
          Exclusive offers handpicked for you. Don't let them slip away.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => navigate("/products")}
            className="relative cursor-pointer group overflow-hidden rounded-3xl p-8 bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            {/* Gradient glow background */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${deal.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${deal.gradient} text-white mb-6 shadow-lg`}>
              {deal.icon}
            </div>

            <span className={`inline-block ml-3 px-2 py-0.5 rounded-full bg-gradient-to-r ${deal.gradient} text-white text-[10px] font-bold uppercase tracking-wider`}>
              {deal.badge}
            </span>

            <h3 className="text-2xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
              {deal.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {deal.description}
            </p>

            <div className="mt-6 flex items-center text-sm font-bold text-gray-900 group-hover:gap-3 gap-2 transition-all">
              <span>Shop Now</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Deals;
