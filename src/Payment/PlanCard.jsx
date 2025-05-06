import React, { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import Payment from "./Payment";
import Api from "../qutree/BaseUrlAPI";
import { Base64 } from "js-base64";
import { useParams } from "react-router-dom";
import NavBar from "../qutree/HomeComponents/WebPages/Navbar";
const PlanCard = () => {
  const { encodedUserId, encodedUserQCardId } = useParams();

  const userId = Base64.decode(encodedUserId);
  const userQCardId = Base64.decode(encodedUserQCardId);
  const [planData, setPlanData] = useState(null);
   const [start, setStart] = useState(false);
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await Api.get(`/user-card-ids/check-card-type?userCardId=${userQCardId}`);
        setPlanData(response.data); // Assuming the response structure matches
      } catch (error) {
        console.error("Error fetching plan data", error);
      }
    };

    fetchPlanData();
  }, [userQCardId]);

  if (!planData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
            <NavBar />
         {!start ? (  
          
    <div className="flex flex-1 justify-center items-center">

      <div className="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 text-black">
          <h2 className="text-3xl text-center font-bold">{planData.name}</h2>
          <p className="mt-2 text-center">
            <span className="line-through text-gray-500">₹{planData.actualPrice}</span>
            <span className="ml-2 text-black  font-bold">₹{planData.discountedPrice}/year</span>
          </p>

          <div className="mt-4">
          <ul className="list-none pl-0">
         {planData.features.map((feature) => (
         <li key={feature.id} className="flex items-center text-black pt-4">
       <HiCheck className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
         <span>{feature.description}</span>
        </li>
        ))}
       </ul>

          </div>

          <div className="mt-4 text-center">
            <button className="px-6 py-2 w-3/4 bg-gradient-to-r from-[#00CBFF] to-[#640D99]  text-white rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={() => setStart(true)}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
    ) : (
        <Payment payableAmount={planData.discountedPrice} purpose={planData.name} userId={userId}/>
      )}
    </div>
  );
};

export default PlanCard;

