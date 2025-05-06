import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import api from "../qutree/BaseUrlAPI";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { Base64 } from "js-base64";
import NavBar from "../qutree/HomeComponents/WebPages/Navbar";

const SuccessComponent = () => {
  const { encodedUserId, encodedOrderId } = useParams();
  const userId = Base64.decode(encodedUserId);
  const orderId = Base64.decode(encodedOrderId);
  const navigate = useNavigate();
  const [transactionStatus, setTransactionStatus] = useState("Processing...");
  const [errorMessage, setErrorMessage] = useState("");

  const updatePaymentStatus = async () => {
    try {
      const response = await api.put(`/${userId}/update-payment-status`, null, {
        params: {
          orderId: orderId
        }
      });

      if (response.status === 200) {
        setTransactionStatus("Payment Status Updated Successfully");
        setErrorMessage(""); // Clear any error message
      } else {
        setTransactionStatus("Failed to Update Payment Status");
        setErrorMessage("Unexpected response from the server.");
      }
    } catch (error) {
      setTransactionStatus("Payment Failed"); // Set to Payment Failed on error
      setErrorMessage(""); // Clear any previous error messages

      // Check for the specific error message
      if (error.response && error.response.status === 400) {
        if (
          error.response.data &&
          error.response.data.message === "Cannot update payment status from FAILED to COMPLETED because orderId is the same."
        ) {
          setErrorMessage("Cannot update the status because the order ID is the same.");
        } else {
          setErrorMessage("An error occurred while updating payment status.");
        }
      } else {
        setErrorMessage("An error occurred while updating payment status.");
      }

      console.error("Error updating payment status:", error);
    }
  };

  useEffect(() => {
    updatePaymentStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
      <header className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </header>
      <div className="bg-white/10 backdrop-blur-md shadow-lg p-10 rounded-lg w-11/12 max-w-md text-center transition transform hover:scale-105">
        {transactionStatus === "Processing..." && (
          <div className="animate-spin text-blue-500 text-4xl flex justify-center">
            <FaSpinner />
          </div>
        )}
        {transactionStatus === "Payment Status Updated Successfully" && (
          <div className="text-white text-6xl animate-bounce flex justify-center">
            <BsCheck2Circle />
          </div>
        )}
        {transactionStatus === "Payment Failed" && (
          <div className="text-red-600 text-6xl flex justify-center">
            <RxCrossCircled />
          </div>
        )}
        <h2
          className={`text-2xl font-bold ${
            transactionStatus === "Processing..."
              ? "text-blue-600"
              : transactionStatus === "Payment Status Updated Successfully"
              ? "text-white"
              : transactionStatus === "Payment Failed"
              ? "text-red-600"
              : "text-red-600"
          }`}
        >
          {transactionStatus === "Payment Failed" ? "Payment Failed" : "Payment Successfully"}
        </h2>
        <p
          className={`text-sm ${
            transactionStatus === "Processing..."
              ? "text-blue-600"
              : transactionStatus === "Payment Status Updated Successfully"
              ? "text-white"
              : transactionStatus === "Payment Failed"
              ? "text-red-600"
              : "text-red-600"
          }`}
        >
          {transactionStatus === "Payment Failed"
            ? "Cannot update the payment status due to a conflict with the order ID."
            : "Thank you for joining us."}
        </p>

        <Button
          className="my-4 py-2 w-full text-white text-base font-medium bg-gradient-to-r from-[#00CBFF] to-[#640D99] hover:from-[#640D99] hover:to-[#00CBFF]"
          onClick={() => navigate("/oauth/login")}
        >
          Continue
        </Button>

        <p
  className={`text-sm ${
    transactionStatus === "Processing..."
      ? "text-blue-600"
      : transactionStatus === "Payment Status Updated Successfully"
      ? "text-white"
      : transactionStatus === "Payment Failed"
      ? "text-red-600"
      : "text-red-600"
  }`}
>
  {transactionStatus === "Payment Failed"
    ? "For assistance with your payment, please contact us."
    : "For advanced edits and management of your digital card, move to the dashboard."}
</p>


        {transactionStatus === "Payment Status Updated Successfully" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-4 py-2 bg-transparent font-medium text-[#035E7B] rounded-lg hover:bg-transparent"
          >
            Go to Dashboard
          </button>
        )}

        {errorMessage && (
          <p className="text-red-500 mt-4 text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SuccessComponent;
