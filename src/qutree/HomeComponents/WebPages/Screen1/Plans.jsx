import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import cn from "classnames"; // Import cn utility
import axios from "../../../BaseUrlAPI";
import Skeleton from "@mui/material/Skeleton"; // Import MUI Skeleton
import NavBar from "../Navbar";
import classNames from "classnames";
import { Base64 } from "js-base64";
const PlansComponent = ({ showNav = true, bgBlack = true }) => {
  const [selectedTab, setSelectedTab] = useState("Professionals");
  const [plansData, setPlansData] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [noPlans, setNoPlans] = useState(false); // Add noPlans state to handle empty response
  const [error, setError] = useState(false); // Add error state to handle API failure
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/plans/categories");
        const { data } = response;

        // Ensure the response is an array before setting it
        if (Array.isArray(data)) {
          if (data.length === 0) {
            setNoPlans(true); // If the response data is empty, show "No plans available"
          } else {
            setPlansData(data); // Set plansData to the array from the response
            setNoPlans(false); // Reset noPlans state if data is not empty
          }
        } else {
          setError(true); // Handle the case if response is not an array
        }

        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError(true); // Set error state if API call fails
        setLoading(false); // Set loading to false after error
      }
    };

    fetchPlans();

    // Simulate a loading time of 2 seconds (this can be adjusted)
    const timer = setTimeout(() => {
      setLoading(false); // Hide skeleton after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  const getActivePlans = () => {
    const selectedCategory = plansData.find(
      (category) => category.name === selectedTab
    );
    return selectedCategory ? selectedCategory.plans : [];
  };

  const getGrid = () => {
    switch (selectedTab) {
      case "Professionals":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case "Students":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case "Organization":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  const renderSkeleton = () => (
    <div
      className={classNames(
        "flex flex-col ",
        { "bg-black ": bgBlack },
        { "bg-transparent": !bgBlack }
      )}
    >
      {/* Header section with Skeleton */}
      <div className="flex items-center p-6 justify-center">
        <div className="border  border-gray-500 rounded-xl bg-white h-[40px] w-[80%] sm:w-[400px] flex items-center justify-start">
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={150}
            height={40}
            style={{ backgroundColor: "red 1px solid", color: "white" }}
            className="rounded-xl border border-gray-500"
          />
        </div>
      </div>

      {/* Main content area with grid layout */}
      <div
        className={classNames(
          "p-8 lg:p-16 rounded-2xl transform grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto transition-all",
          { "bg-black ": bgBlack },
          { "bg-transparent": !bgBlack }
        )}
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-8 bg-white h-[600px] rounded-2xl shadow-md max-w-sm md:min-w-[250px] min-w-[330px] mx-auto"
          >
            <div className="flex items-center justify-center">
              <Skeleton
                animation="wave"
                variant="text"
                width="40%"
                height={20}
                className="mt-4 "
              />
            </div>
            <div className="px-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  animation="wave"
                  key={index}
                  variant="rectangular"
                  width="100%"
                  height={30}
                  className="my-6"
                />
              ))}
            </div>

            <div className="flex justify-center items-center">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={150}
                height={40}
                className="mt-4 rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={classNames(
        " w-full pb-4",
        { "bg-black": bgBlack },
        { "bg-transparent": !bgBlack }
      )}
    >
      <div
        className={classNames({
          "min-h-screen bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]":
            bgBlack,
        })}
      >
        {showNav && <NavBar />}
        <div className="max-w-7xl mx-auto mb-5 sm:px-6 lg:px-8 mt-20">
          <div className="flex flex-col items-center justify-center font-inter">
            <h2 className="text-[48px] text-white font-[700] tracking-tight mb-4 sm:text-4xl">
              Pricing Structure
            </h2>
            <p className="mt-3 text-sm text-gray-400 italic">
              "Unlock Possibilities with the Right Plan"
            </p>
          </div>
        </div>

        {loading ? (
          renderSkeleton() // Show skeleton while loading
        ) : error ? (
          <div>
            <div className="flex justify-center items-center flex-col text-black text-xl font-bold p-10">
              {renderSkeleton()}
              <p className="text-[15px] font-[500] text-red-600">
                Error fetching plans. Please try again later.
              </p>
            </div>
          </div>
        ) : noPlans ? (
          <div className="flex justify-center items-center text-black text-xl font-bold p-10">
            <p>No plans available</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-2">
            <div className="flex justify-center mb-12 md:mb-12">
              <div className="inline-flex rounded-md shadow-sm p-1 bg-white border border-gray-500">
                {plansData &&
                  plansData.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTab(category.name)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        {
                          "bg-purple-600 text-white":
                            selectedTab === category.name,
                          "text-black hover:text-black":
                            selectedTab !== category.name,
                        }
                      )}
                    >
                      {category.name}
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Plans Grid */}
            <div
              className={cn(getGrid(), {
                "grid gap-6 lg:gap-8": selectedTab !== "Organization",
                "flex justify-center": selectedTab === "Organization",
              })}
            >
              {getActivePlans().map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "relative p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    {
                      "ring-2 ring-purple-500": plan.popular,
                      "max-w-[600px] ": selectedTab === "Organization",
                    }
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Most popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-blacke">
                      {plan.name}
                    </h3>
                    {selectedTab !== "Organization" && (
                      <div className="mt-4 flex items-baseline justify-center">
                        <span className="text-4xl font-extrabold text-blacke">
                          ₹{plan.discountedPrice}
                        </span>
                        {/* <span className="ml-1 text-xl font-semibold text-blacke">
                          /year
                        </span> */}
                      </div>
                    )}
                    {/* {selectedTab !== "Organization" && (
                      <p className="mt-2 line-through text-gray-500">
                        ₹{plan.actualPrice}
                      </p>
                    )} */}
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-blacke">
                          {feature.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="h-16"></div>
                  <div className="w-full flex justify-center items-center absolute bottom-5 left-0 right-0 ">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-8 w-[90%] inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                      onClick={() => {
                        if (selectedTab === "Organization") {
                          navigate("/support");
                        } else {
                          const encodedId = Base64.encode(plan.id);
                          const encodedCategoryName =
                            Base64.encode(selectedTab);
                          navigate(
                            `/oauth/signup?encodedId=${encodedId}&encodedCategoryName=${encodedCategoryName}`
                          );
                        }
                      }}
                    >
                      {selectedTab === "Organization"
                        ? "Contact Us"
                        : "Get Started"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="sm:ml-[15%] px-1 sm:mr-[15%]">
          <div className="flex justify-center items-center bg-white ring-4 ring-purple-500 mt-20 w-full rounded-md p-4">
            <div className="flex flex-col sm:flex-row gap-6 w-full items-center p-2">
              <div className="flex flex-col text-start w-full sm:w-auto">
                <div className="text-[30px] font-bold font-inter bg-clip-text">
                  Get <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">30</span> Days of Unlimited Access
                </div>
                <div className="text-[#757F8D] font-inter italic">
                  Experience the power of QUIKYNET with a risk-free trial. No credit card required!
                </div>
              </div>
              <button 
              className="mt-4 sm:mt-0 text-white py-3 px-6 font-inter font-bold text-[20px] rounded-3xl bg-gradient-to-r from-blue-400 to-purple-600 focus:ring-purple-500 transition-all w-full sm:w-auto"
              onClick={() => navigate('/oauth/signup')}
              >
                Start Trial
              </button>
            </div>
          </div>
        </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PlansComponent;
