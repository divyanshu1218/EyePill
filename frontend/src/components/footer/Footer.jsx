import { Link } from "react-router-dom";
import { AiFillGithub, AiFillTwitterCircle, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";
import Logo from "../navbar/Logo";

const quickLinks = [
    { label: "Latest Collection", to: "/products" },
    { label: "Best Sellers", to: "/products?sort=best-sellers" },
    { label: "Special Offers", to: "/products?offer=true" },
    { label: "About Us", to: "/" },
];

const supportLinks = [
    { label: "Shipping Policy", href: "mailto:support@eyepill.com?subject=Shipping%20Policy" },
    { label: "Returns & Refunds", href: "mailto:support@eyepill.com?subject=Returns%20%26%20Refunds" },
    { label: "Privacy Policy", href: "mailto:support@eyepill.com?subject=Privacy%20Policy" },
    { label: "Contact Support", href: "mailto:support@eyepill.com" },
];

const socialLinks = [
    { icon: AiFillInstagram, href: "https://www.instagram.com" },
    { icon: AiFillTwitterCircle, href: "https://www.twitter.com" },
    { icon: AiFillLinkedin, href: "https://www.linkedin.com" },
    { icon: AiFillGithub, href: "https://www.github.com" },
];

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
                        {socialLinks.map(({ icon: Icon, href }) => (
                            <a key={href} href={href} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Quick Links</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {quickLinks.map(link => (
                            <li key={link.label}>
                                <Link to={link.to} className="hover:text-white transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Support</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {supportLinks.map(link => (
                            <li key={link.label}>
                                <a href={link.href} className="hover:text-white transition-colors">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Contact Us</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li>
                            <a href="mailto:support@eyepill.com" className="hover:text-white transition-colors">Email: support@eyepill.com</a>
                        </li>
                        <li>
                            <a href="tel:+919876543210" className="hover:text-white transition-colors">Phone: +91 98765 43210</a>
                        </li>
                        <li>Address: 123 Vision Avenue, <br />Cyber City, India</li>
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
