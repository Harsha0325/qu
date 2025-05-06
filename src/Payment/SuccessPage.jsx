import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import api from "../qutree/BaseUrlAPI";
import { useNavigate, useParams } from "react-router-dom";

const SuccessPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
  const [transactionStatus, setTransactionStatus] = useState("Processing...");
  const [errorMessage, setErrorMessage] = useState("");
  const jwtToken = localStorage.getItem("jwtToken");
  const updatePaymentStatus = async () => {
    try {
      const response = await api.put(
        `/${userId}/update-payment-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Include the token in the Authorization header
          },
        }
      );
      if (response.status === 200) {
        // Set the response message and update the transaction status

        setTransactionStatus("Payment Status Updated Successfully");
      } else {
        setTransactionStatus("Failed to Update Payment Status");
        setErrorMessage("Unexpected response from the server.");
      }
    } catch (error) {
      setTransactionStatus("Failed to Update Payment Status");
      setErrorMessage("An error occurred while updating payment status.");
      console.error("Error updating payment status:", error);
    }
  };

  useEffect(() => {
    // Call the payment status update API once on page load
    updatePaymentStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md text-center transition transform hover:scale-105">
        {transactionStatus === "Processing..." && (
          <div className="animate-spin text-blue-500 text-4xl flex justify-center">
            <FaSpinner />
          </div>
        )}
        {transactionStatus === "Payment Status Updated Successfully" && (
          <div className="text-green-500 text-6xl animate-bounce flex justify-center">
            <BsCheck2Circle />
          </div>
        )}
        <h2
          className={`text-2xl font-bold ${
            transactionStatus === "Processing..."
              ? "text-blue-600"
              : transactionStatus === "Payment Status Updated Successfully"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
           Payment Successfully
        </h2>
        {errorMessage && (
          <p className="text-red-500 mt-4 text-sm">{errorMessage}</p>
        )}
      </div>
      {transactionStatus === "Payment Status Updated Successfully" && (
        <button
          onClick={() => navigate("/dashboard")} // Navigate to the dashboard
          className="mt-6 px-4 py-2 bg-[#035E7B] text-white rounded-lg hover:bg-[#035E7B]"
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
};

export default SuccessPage;
