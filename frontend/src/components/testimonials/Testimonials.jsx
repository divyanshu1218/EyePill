import { motion } from "framer-motion";
import { GiRoundStar } from "react-icons/gi";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Fashion Enthusiast",
    rating: 5,
    text: "Absolutely love my new sunglasses from EyePill! The quality is premium and the delivery was super fast. Best eyewear shopping experience I've ever had.",
    initials: "PS",
    color: "bg-violet-100 text-violet-600",
  },
  {
    name: "Rahul Verma",
    role: "Tech Professional",
    rating: 5,
    text: "The blue-light blocking glasses are a game changer for my work-from-home setup. Crystal clear vision and incredibly stylish. Highly recommended!",
    initials: "RV",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Ananya Patel",
    role: "Sports Coach",
    rating: 4,
    text: "Bought sports glasses for my team. Great durability, perfect fit, and amazing price point. EyePill is our go-to brand now.",
    initials: "AP",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Vikram Singh",
    role: "Verified Buyer",
    rating: 5,
    text: "The lens quality is unmatched at this price range. I've been wearing EyePill glasses for 6 months and they still look brand new.",
    initials: "VS",
    color: "bg-amber-100 text-amber-600",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 px-[4%] md:px-[10%]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          What Our Customers Say
        </h2>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto">
          Real reviews from real people who trust EyePill for their eyewear needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <GiRoundStar
                  key={i}
                  className={`text-sm ${i < testimonial.rating ? "text-yellow-400" : "text-gray-200"}`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-6">
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
              <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-sm`}>
                {testimonial.initials}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-[11px] text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
