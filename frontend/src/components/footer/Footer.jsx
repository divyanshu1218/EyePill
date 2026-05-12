import { AiFillGithub, AiFillTwitterCircle, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";
import Logo from "../navbar/Logo";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-[4%] md:px-[10%] mt-20 rounded-t-[3rem]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="flex flex-col gap-4">
                    <Logo />
                    <p className="text-sm leading-relaxed text-gray-400">
                        Experience the best in eyewear. From premium sunglasses to precision lenses, we provide quality that helps you see the world differently.
                    </p>
                    <div className="flex gap-4 text-2xl mt-2">
                        <AiFillInstagram className="hover:text-pink-500 cursor-pointer transition-colors" />
                        <AiFillTwitterCircle className="hover:text-blue-400 cursor-pointer transition-colors" />
                        <AiFillLinkedin className="hover:text-blue-600 cursor-pointer transition-colors" />
                        <AiFillGithub className="hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Quick Links</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li className="hover:text-white cursor-pointer transition-colors">Latest Collection</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Best Sellers</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Special Offers</li>
                        <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Support</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li className="hover:text-white cursor-pointer transition-colors">Shipping Policy</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Returns & Refunds</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Contact Us</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li>Email: support@eyepill.com</li>
                        <li>Phone: +91 98765 43210</li>
                        <li>Address: 123 Vision Avenue, <br/>Cyber City, India</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} EyePill. All rights reserved.</p>
                <div className="flex gap-6">
                    <span>Designed for Excellence</span>
                    <span>Powered by Advanced AI</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
