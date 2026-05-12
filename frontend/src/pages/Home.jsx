import { useRef } from "react";
import { Banner, CategoryList, Footer, Trending, Features, Newsletter } from "../components";
import homeBg from "../assets/home_premium_bg.png";

const Home = () => {
  const catRef = useRef(null);
  return (
    <div className="relative min-h-screen">
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
      <Trending />
      <CategoryList catRef={catRef} />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
