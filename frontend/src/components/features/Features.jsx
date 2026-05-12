import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineSupport, HiOutlineCurrencyDollar } from "react-icons/hi";

const Features = () => {
    const features = [
        { icon: <HiOutlineTruck />, title: "Free Shipping", desc: "On orders over ₹1999" },
        { icon: <HiOutlineShieldCheck />, title: "Secure Payment", desc: "100% secure payment methods" },
        { icon: <HiOutlineSupport />, title: "24/7 Support", desc: "We are here to help anytime" },
        { icon: <HiOutlineCurrencyDollar />, title: "Easy Returns", desc: "30-day return policy" }
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-gray-100 my-12">
            {features.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                    <div className="text-4xl text-blue-600 mb-4 transition-transform group-hover:scale-110">
                        {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                </div>
            ))}
        </section>
    );
};

export default Features;
