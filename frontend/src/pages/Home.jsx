import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Banner, CategoryList, Footer, Trending, Features, Newsletter, Deals, Testimonials } from "../components";
import homeBg from "../assets/home_premium_bg.png";

const Home = () => {
  const catRef = useRef(null);
  return (
    <div className="relative min-h-screen">
      <Helmet>
        <title>EyePill — Premium Eyewear Store</title>
        <meta name="description" content="Shop premium sunglasses, optical glasses, and sports eyewear at EyePill. Discover the latest designer eyewear with fast shipping." />
      </Helmet>
      {/* Premium Glassmorphism Background Layer */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.08] pointer-events-none"
        style={{ 
          backgroundImage: `url(${homeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      <Banner catRef={catRef} />
      <Features />
      <Deals />
      <Trending />
      <CategoryList catRef={catRef} />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
