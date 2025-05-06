import { BiLogInCircle } from "react-icons/bi"; 
import React, { useContext } from "react";
import { PaymentContext } from "./PaymentContext";
import { useNavigate } from "react-router-dom";
import TrialEnd from "../image/TrialEnd.png";
import { useAuth } from "./AuthContext";

const PaymentModal = () => {
  const { showPaymentModal, setShowPaymentModal, encodedUserId, encodedUserQCardId, formAgent } = useContext(PaymentContext);
  const navigate = useNavigate();
  const { logout } = useAuth() || {};

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProceedToPayment = () => {
    const paymentPage = formAgent 
      ? `/plan-card/${encodedUserId}/${encodedUserQCardId}` 
      : "/pricing";

    setShowPaymentModal(false); 
    navigate(paymentPage);
  };

  if (!showPaymentModal) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative flex flex-col justify-center items-center bg-gradient-to-r from-[#066882] to-[#00CBFF] p-4 rounded-lg mt-4 sm:w-[50%] w-[95%]">
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="absolute top-2 right-2 flex items-center gap-1 bg-white text-red-500 font-bold px-3 py-1 rounded-md shadow-md"
        >
          Logout <BiLogInCircle size={20} />
        </button>

        <img src={TrialEnd} alt="Trial end" />
        <div className="flex flex-col justify-center items-center pt-2">
          <div className="text-white font-inter text-[30px] font-bold">
            {formAgent ? "Please upgrade your plan." : "Your Trial has expired"}
          </div>
          <div className="text-[#CECECE] font-inter italic">
            Unlock uninterrupted access to all advanced features by upgrading now.
          </div>
          <button 
            className="bg-white py-4 px-6 rounded-3xl text-[#000000] font-bold font-inter mt-2"
            onClick={handleProceedToPayment}
          >
            Upgrade now
          </button>
          <button 
            className="bg-transparent rounded-3xl underline text-[#002AFF] font-inter mt-2"
            onClick={() => navigate("/pricing")}
          >
            View plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
