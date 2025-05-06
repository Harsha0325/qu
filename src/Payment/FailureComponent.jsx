import { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import api from "../qutree/BaseUrlAPI";
import { useParams } from "react-router-dom";
import { Base64 } from "js-base64";
import NavBar from "../qutree/HomeComponents/WebPages/Navbar";
const FailureComponent = () => {
  const [transactionStatus, setTransactionStatus] = useState("Processing...");
  const [errorMessage, setErrorMessage] = useState("");

  const { encodedUserId, encodedOrderId } = useParams();
  const userId = Base64.decode(encodedUserId);
  const orderId = Base64.decode(encodedOrderId);
  const updatePaymentStatusToFailed = async () => {
    try {
      const response = await api.put(`/${userId}/update-payment-failed`, null, {
        params: {
          orderId: orderId
        }
      });
      if (response.status === 200) {
        // Set response message and update transaction status
        setTransactionStatus("FAILED");
      } else {
        setTransactionStatus("Failed to Update Payment Status");
        setErrorMessage("Unexpected response from the server.");
      }
    } catch (error) {
      setTransactionStatus("Failed to Update Payment Status");
      setErrorMessage("An error occurred while updating payment status.");
    }
  };

  useEffect(() => {
    // Call the payment status update API once on page load
    updatePaymentStatusToFailed();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
      <header className="fixed top-0 left-0 w-full z-50">
      <NavBar />
    </header>
      <div className="bg-white/10 backdrop-blur-md shadow-lg p-10  rounded-lg  w-11/12 max-w-md text-center flex flex-col items-center justify-center">
        {transactionStatus === "Processing..." && (
          <div className="animate-spin text-red-500 text-4xl flex justify-center">
            <RxCrossCircled />
          </div>
        )}
        {transactionStatus === "FAILED" && (
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
        {transactionStatus === "FAILED" && (
          <p className="mt-4 text-white">
            We couldn’t complete your payment. Let’s resolve this quickly!
          </p>
        )}
        {transactionStatus === "Failed to Update Payment Status" && (
          <div>
            <p className="mt-4 text-white">
              Please check the transaction details or contact support for
              further assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FailureComponent;
