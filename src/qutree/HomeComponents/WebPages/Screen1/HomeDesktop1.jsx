import frame1 from "../../../../image/HomeImages/frame1.svg";
import { useNavigate } from "react-router-dom";
import { FaShareNodes } from "react-icons/fa6";
import { LuFileCog } from "react-icons/lu";
import { FaPenFancy } from "react-icons/fa";
import howItWorks1 from "../../../../image/Homev1/howItWorks1.png";
import howItWorks2 from "../../../../image/Homev1/howItWorks2.png";
import howItWorks3 from "../../../../image/Homev1/howItWorks3.png";
import howItWorks4 from "../../../../image/Homev1/howItWorks4.png";
import { useEffect, useState } from "react";
import cn from "classnames";

const HomeDesktop1 = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([
    false,
    false,
    false,
    false,
  ]);

  const navigate = useNavigate();
  const images = [howItWorks1, howItWorks2, howItWorks3, howItWorks4];

  const handleImageLoad = (index) => {
    const updatedLoadedImages = [...loadedImages];
    updatedLoadedImages[index] = true;
    setLoadedImages(updatedLoadedImages);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center bg-cover bg-center h-full text-white overflow-hidden ">
      <div className="relative flex flex-col justify-center items-center w-full max-w-[1440px]  overflow-y-scroll scrollbar-hide ">
        <div className="flex w-full  pt-32 mb-16 ">
          <div className="flex items-center w-[60%] overflow-hidden">
            <div className="pl-10">
              <div className="inline-block relative mt-32 lg:mt-0 w-[782px] font-extrabold font-inter text-[10px] text-left text-web-white lg:text-[30px] md:leading-[50px] tracking-[5px] md:tracking-[3px]">
                <p className="m-0 font-extrabold text-5xl lg:text-4xl leading-[46px] tracking-[5px]">
                  Digital Business Cards
                </p>
                <p className="m-0 font-extrabold text-5xl lg:text-4xl leading-[46px] lg:py-3 tracking-[5px]">{`for the Modern `}</p>
                <p className="m-0 font-extrabold text-5xl lg:text-4xl leading-[46px] tracking-[5px]">
                  {" "}
                  Professional{" "}
                </p>
              </div>

              <div className="relative flex items-center mt-10  w-[782px] font-poppins text-[20px] text-left text-web-white text-wrap lg:text-[15px] tracking-[1.5px] md:tracking-[1px] lg:mt-10">
                Design, share, and manage your digital business card with
                QuikyNet.
              </div>

              <div className="relative flex flex-row justify-start items-center border-[1px] border-snow bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] mt-36 lg:mt-6 ml-4 border-solid rounded-[10px] w-[300px] h-12 font-inter text-[16px] text-black text-center text-gray box- hover:scale-105">
                <div className="flex flex-row justify-center items-center m-auto p-3 rounded-sm overflow-hidden hover:scale-105">
                  <button
                    className="relative font-semibold text-center leading-[140%]"
                    onClick={() => navigate("/oauth/signup")}
                  >
                    Get your Digital Business Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-[40%] pr-2">
            <div className="flex flex-col justify-around w-[10%] h-[100%]">
              <div
                className={`lg:text-base xl:text-3xl bg-purple-700 p-3 rounded-lg animate-zoom-in-out`}
              >
                <FaPenFancy />
              </div>
              <div
                className={`lg:text-base xl:text-3xl bg-purple-700 p-3 rounded-md animate-zoom-in-out`}
              >
                <LuFileCog />
              </div>
            </div>

            <div className="w-[70%] h-[100%]">
              {" "}
              <img className="m-auto w-[360px] h-[100%]" alt="" src={frame1} />
            </div>

            <div className="flex items-center w-[10%] h-[100%] pl-2">
              <div
                className={`lg:text-base xl:text-3xl bg-purple-700 p-3 rounded-lg animate-zoom-in-out3`}
              >
                <FaShareNodes />
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-32   mb-16  w-[100%] h-[100%]">
          <div className="flex flex-row w-[40%] lg:pl-5">
            <div className="flex flex-col justify-around w-[10%] h-[100%]">
              <div
                className={`lg:text-base xl:text-3xl bg-purple-700 p-3 rounded-lg animate-zoom-in-out1`}
              >
                <FaPenFancy />
              </div>
              <div
                className={`lg:text-base xl:text-3xl bg-purple-700 p-3 rounded-md animate-zoom-in-out `}
              >
                <LuFileCog />
              </div>
            </div>

            <div className="w-[70%] h-[100%] lg:ml-3">
              <img className="m-auto w-[360px] h-[100%]" alt="" src={frame1} />
            </div>

            <div className="flex items-center w-[10%] h-[100%]">
              <div
                className={`lg:text-base xl:text-3xl bg-purple-700 p-3 rounded-lg animate-zoom-in-out3 lg:ml-2`}
              >
                <FaShareNodes />
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-center items-center p-10 w-[60%] h-[full] overflow-hidden ">
            <div className="absolute w-[540px] overflow-hidden  bg-white/10 backdrop-blur-md shadow-lg p-10 rounded-3xl border-2 border-cyan-500 xl:w-[550px] lg:w-[450px]">
              <div className="h-[10%] font-inter text-[50px] text-left lg:text-[30px] p-3">
                What is QuikyNet ?
              </div>
              <div className="mt-20 lg:mt-[20px] pl-10 lg:pl-[2px] lg:w-[100%] font-[ text-[21px] text-left lg:text-[15px] leading-[52px] lg:leading-[25px] Poppins]">
                <span className="pl-10"> A digital business</span> card is an
                electronic version of a traditional business card. It contains
                your contact details, links, and multimedia elements, shared via
                QR codes, email, or apps. It’s eco-friendly, customizable, easy
                to update, and ideal for networking in the digital age.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center ">
          <div className="flex justify-center items-center w-[80%]"></div>
        </div>
        <div className="flex items-center justify-center w-full ">
          <div className="flex flex-col items-center justify-start  w-[68%] h-[100%] ">
            <div className="w-[66%] lg:w-[100%] text-left font-[400] font-lilitaOne text-[94px] lg:text-[55px] leading-[107.44px] tracking-[2px] ">
              How It Works?
            </div>

            {/* Step 1 */}
            <div className="w-full mt-10 ">
              <div
                onClick={() => setImgIndex(0)}
                className={cn(
                  "pl-10 w-[100%] text-left font-[700] font-[inter] text-[43px] lg:text-[25px] leading-[52.04px] tracking-[3px]",
                  imgIndex === 0
                    ? "text-white transform scale-110 transition-all duration-300"
                    : "text-gray-600"
                )}
              >
                1. Create your personal account
              </div>
              <div
                onClick={() => setImgIndex(0)}
                className={cn(
                  "pl-32 pr-5 w-[100%]  text-left text-wrap break-words  font-[300] font-[inter] text-[#FCFAF6] text-[24px] lg:text-[16px] leading-[29.09px]",
                  imgIndex === 0
                    ? "opacity-100 transform scale-110 transition-all duration-300"
                    : "opacity-50"
                )}
                style={{
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  overflow: "hidden",
                }}
              >
                Provide your personal information and create a password to
                access your comprehensive profile
              </div>
            </div>

            {/* Step 2 */}
            <div className="w-full mt-10">
              <div
                onClick={() => setImgIndex(1)}
                className={cn(
                  "pl-10 w-[100%] text-left font-[700] font-[inter] text-[43px] lg:text-[25px] leading-[52.04px] lg:leading-[30px] tracking-[3px]",
                  imgIndex === 1
                    ? "text-white transform scale-110 transition-all duration-300"
                    : "text-gray-600"
                )}
              >
                2. Pick Your Plan & Pay Securely
              </div>
              <div
                onClick={() => setImgIndex(1)}
                className={cn(
                  "pl-32 pr-5 w-[100%] text-left font-[300] font-[inter] text-[#FCFAF6] text-[24px] lg:text-[16px] leading-[29.09px] lg:leading-[24px]",
                  imgIndex === 1
                    ? "opacity-100 transform scale-110 transition-all duration-300"
                    : "opacity-50"
                )}
              >
                Choose the plan that best suits your needs and proceed to make a
                secure payment to get started
              </div>
            </div>

            {/* Step 3 */}
            <div className="w-full mt-10">
              <div
                onClick={() => setImgIndex(2)}
                className={cn(
                  "pl-10 w-[100%] text-left font-[700] font-[inter] text-[43px] lg:text-[25px] leading-[52.04px] lg:leading-[30px] tracking-[3px]",
                  imgIndex === 2
                    ? "text-white transform scale-110 transition-all duration-300"
                    : "text-gray-600"
                )}
              >
                3. Enter your Details & Upload your profile picture
              </div>
              <div
                onClick={() => setImgIndex(2)}
                className={cn(
                  "pl-32 pr-5 w-[100%] text-left font-[300] font-[inter] text-[#FCFAF6] text-[24px] lg:text-[16px] leading-[29.09px] lg:leading-[24px]",
                  imgIndex === 2
                    ? "opacity-100 transform scale-110 transition-all duration-300"
                    : "opacity-50"
                )}
              >
                Provide your personal information and social media links to
                create a comprehensive profile
              </div>
            </div>

            {/* Step 4 */}
            <div className="w-full mt-10">
              <div
                onClick={() => setImgIndex(3)}
                className={cn(
                  "pl-10 w-[100%] text-left font-[700] font-[inter] text-[43px] lg:text-[25px] leading-[52.04px] lg:leading-[30px] tracking-[3px]",
                  imgIndex === 3
                    ? "text-white transform scale-110 transition-all duration-300"
                    : "text-gray-600"
                )}
              >
                4. Select your theme
              </div>
              <div
                onClick={() => setImgIndex(3)}
                className={cn(
                  "pl-32 pr-5 w-[100%] text-left font-[300] font-[inter] text-[#FCFAF6] text-[24px] lg:text-[16px] leading-[29.09px] lg:leading-[24px]",
                  imgIndex === 3
                    ? "opacity-100 transform scale-110 transition-all duration-300"
                    : "opacity-50"
                )}
              >
                Pick from a variety of themes to find the perfect look that
                suits your style.
              </div>
              <div
                onClick={() => setImgIndex(3)}
                className={cn(
                  "pl-32 pr-5 w-[100%] text-left font-[300] font-[inter] text-[#FCFAF6] text-[24px] lg:text-[16px] leading-[29.09px] lg:leading-[24px]",
                  imgIndex === 3
                    ? "opacity-100 transform scale-110 transition-all duration-300"
                    : "opacity-50"
                )}
              >
                Then press submit to preview your Quikynet Digital Business
                card.
              </div>
            </div>
          </div>

          <div className=" flex  items-center justify-center w-[32%] h-[850px] pt-28">
            <div className="relative w-[100%] h-[100%] ">
              {images.map((image, index) => (
                <img
                  key={index}
                  className={`w-[360px]  h-[100%]   absolute top-0 right-0 transition-opacity duration-700 ease-in-out ${
                    imgIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  alt={`How it works step ${index + 1}`}
                  src={image}
                  onError={() => console.log("Image failed to load")}
                  onLoad={() => handleImageLoad(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDesktop1;
