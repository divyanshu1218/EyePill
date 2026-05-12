import { useState } from "react";
import { notify } from "../../utils/utils";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            notify("success", "Subscribed successfully!");
            setEmail("");
        }
    };

    return (
        <section className="bg-blue-600 rounded-3xl p-8 md:p-16 my-20 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
            <div className="z-10 max-w-lg">
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Stay in the loop.</h2>
                <p className="text-blue-100 text-lg">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            </div>
            <form onSubmit={handleSubmit} className="z-10 flex flex-col sm:flex-row w-full md:w-auto gap-4">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-6 py-4 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full md:w-80 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="px-8 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-xl">
                    Subscribe
                </button>
            </form>
        </section>
    );
};

export default Newsletter;
