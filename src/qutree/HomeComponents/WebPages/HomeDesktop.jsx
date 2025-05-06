import React, { useEffect, useState } from "react";
import HomeDesktop2 from "./Screen1/HomeDesktop2";
import NavBar from "./Navbar";
import HomeMobile from "./HomeMobile";
import HomeDesktop1 from "./Screen1/HomeDesktop1";
import HomeDesktop3 from "./Screen1/HomeDesktop3";
import Footer from "./Screen3mobile/HomeMobileScreen8";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      ↑
    </button>
  );
};

const HomeDesktop = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black/50 to-transparent">
        <NavBar />
      </div>
      {isMobile ? (
        <div>
          <HomeMobile />
        </div>
      ) : (
        <div>
          <div className="max-w-7xl mx-auto  ">
            <HomeDesktop1 />
            <HomeDesktop2 />
            <HomeDesktop3 />
          </div>
          <Footer />
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default HomeDesktop;
