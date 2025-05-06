import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { FeatureSection } from "../FeatureSection";
import { features } from "../featureData";
import NetworkingFeatures from "../Screen3mobile/HomeMobileScreen6";
import FAQPage from "../Screen3mobile/HomeMobileScreen7";
import PlansComponent from "./Plans";

const useIntersectionObserver = (options = {}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [containerRef, isVisible];
};

const HomeDesktop3 = () => {
  const [titleRef, isTitleVisible] = useIntersectionObserver();
  const [featuresRef, areFeaturesVisible] = useIntersectionObserver();
  const [illustrationRef, isIllustrationVisible] = useIntersectionObserver();
  const [networkingRef, isNetworkingVisible] = useIntersectionObserver();
  const [faqRef, isFaqVisible] = useIntersectionObserver();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex flex-col pt-6 pb-24 pl-14 max-md:pb-24 max-md:pl-5 w-full">
        <div className="z-10 mt-14 max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-9/12 max-md:ml-0 max-md:w-full">
              <div
                ref={titleRef}
                className={`flex z-10 flex-col mr-0 w-full font-bold max-md:max-w-full 
                  transition-all duration-500 ease-out 
                  ${
                    isTitleVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-20"
                  }`}
              >
                <div className="flex flex-wrap gap-3 self-start text-7xl text-center text-white text-opacity-90 tracking-[2px] max-md:text-4xl">
                  <div className="max-md:text-4xl">Why Choose QuickyNet?</div>
                </div>

                <div
                  ref={featuresRef}
                  className={`flex flex-col items-end self-end mt-6 w-full text-4xl text-white max-w-[1217px] max-md:max-w-full
                    transition-all duration-500 ease-out delay-200
                    ${
                      areFeaturesVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-20"
                    }`}
                >
                  {features.map((feature, index) => (
                    <FeatureSection
                      key={index}
                      title={feature.title}
                      description={feature.description}
                      alignment={feature.alignment}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={illustrationRef}
              className={`flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full z-10
                transition-all duration-100 ease-out delay-200
                ${
                  isIllustrationVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
            >
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/803135efa1c24dd3b1617cdd92a0cf81/36893e159988fd814a4adb35cbd27cd381ba50e502866528f52a8db8a000c222?apiKey=803135efa1c24dd3b1617cdd92a0cf81&"
                alt="QuickyNet feature illustration"
                className="object-contain grow mt-28 w-full aspect-[0.68] max-md:mt-10 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={networkingRef}
        className={`transition-all duration-100 ease-out delay-200
          ${
            isNetworkingVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
      >
        <NetworkingFeatures />
      </div>
      <PlansComponent showNav={false} bgBlack={false} />
      <div
        ref={faqRef}
        className={`transition-all duration-100 ease-out delay-200          
          ${
            isFaqVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
      >
        <FAQPage />
      </div>
    </div>
  );
};

export default HomeDesktop3;
