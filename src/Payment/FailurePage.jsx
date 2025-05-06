import { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import api from "../qutree/BaseUrlAPI";
import { useParams } from "react-router-dom";

const FailurePage = () => {
  const [transactionStatus, setTransactionStatus] = useState("Processing...");
  const [errorMessage, setErrorMessage] = useState("");
  const { userId } = useParams();
  
  const updatePaymentStatusToFailed = async () => {
    try {
      // Retrieve the token from localStorage (or your preferred storage)
      const token = localStorage.getItem("jwtToken") || ""; 
  
      const response = await api.put(
        `/${userId}/update-payment-failed`,
        {}, // If the API requires a body, include it here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
  
      if (response.status === 200) {
        // Set response message and update transaction status
        setTransactionStatus("Payment Status Updated to FAILED");
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
    updatePaymentStatusToFailed();
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <div className="shadow-lg rounded-lg p-6 w-11/12 max-w-md text-center flex flex-col items-center justify-center">
        {transactionStatus === "Processing..." && (
          <div className="animate-spin text-red-500 text-4xl flex justify-center">
            <RxCrossCircled />
          </div>
        )}
        {transactionStatus === "Payment Status Updated to FAILED" && (
          <div className="text-red-500 text-6xl flex justify-center">
            <RxCrossCircled />
          </div>
        )}
        <h2
          className={`text-2xl font-bold ${
            transactionStatus === "Processing..."
              ? "text-red-600"
              : transactionStatus.includes("FAILED")
              ? "text-red-600"
              : "text-red-600"
          }`}
        >
          Transaction Failed
        </h2>
        {errorMessage && (
          <p className="text-red-500 mt-4 text-sm">{errorMessage}</p>
        )}
        {transactionStatus === "Payment Status Updated to FAILED" && (
          <p className="mt-4 text-black">
            We couldn’t complete your payment. Let’s resolve this quickly!
          </p>
        )}
        {transactionStatus === "Failed to Update Payment Status" && (
          <div>
            <p className="mt-4 text-black">
              Please check the transaction details or contact support for
              further assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FailurePage;
