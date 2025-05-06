import React, { useEffect, useState } from "react";
import { message } from "antd";
import CCAvenuePaymentForm from "./CCAvenuePaymentForm";
import p_api from "./APIs/PaymentApi";
import { Base64 } from "js-base64";
const local_redirect = import.meta.env.VITE_REDIRECT_LOCAL;
const local_cancel = import.meta.env.VITE_CANCEL_LOCAL;

const dev_redirect = import.meta.env.VITE_REDIRECT_DEV;
const dev_cancel = import.meta.env.VITE_CANCEL_DEV;

const PaymentComponent = ({ payableAmount, purpose }) => {
  const [htmlContent, setHtmlContent] = useState({});
  const [ccerror, setError] = useState("");
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const isProduction = window.location.href.includes("https://quikynet.com");

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    fetchPaymentForm();
  }, [payableAmount]);

  const generateOrderId = () => {
    // Get the current date and time in the required format (YYYYMMDDHHMMSSMMM)
    const now = new Date();
    const date =
      now.getFullYear().toString().padStart(4, "0") +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0") +
      now.getMilliseconds().toString().padStart(3, "0");

    // Generate a random 8-character uppercase alphanumeric suffix
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Combine the prefix "QKY-" with the date format and random suffix
    const orderId = `QKY-${date}-${randomSuffix}`;

    return orderId;
  };

  // Example usage
  const orderId = generateOrderId();
  console.log(orderId);

  const fetchPaymentForm = async () => {
    const orderId = generateOrderId(); // Generate order ID using the function
    const redirect = isProduction ? dev_redirect : local_redirect;
    const cancel = isProduction ? dev_cancel : local_cancel;

      const encodedUserId = Base64.encode(userId);
      const encodedOrderId = Base64.encode(orderId);

    const paymentData = {
      order_id: orderId,
      amount: payableAmount,
      redirect_url: redirect,
      cancel_url: cancel,
      hostname: isProduction ? "https://quikynet.com" : "http://localhost:5173",
      purpose: purpose, 
      qkyUserId: userId,
      successpage: isProduction
        ? `https://quikynet.com/payment/success/${encodedUserId}/${encodedOrderId}`
        : `http://localhost:5173/payment/success/${encodedUserId}/${encodedOrderId}`,
      failurepage: isProduction
        ? `https://quikynet.com/payment/failure/${encodedUserId}/${encodedOrderId}`
        : `http://localhost:5173/payment/failure/${encodedUserId}/${encodedOrderId}`,
    };
    try {
      const response = await p_api.post("/initiatepayment", paymentData);

      if (response.status === 200) {
        setHtmlContent({
          encRequest: response.data.encRequest,
          accessCode: response.data.accessCode,
          link: response.data.link,
        });
        setPaymentInitiated(true);
      } else {
        message.error("Error fetching payment form.");
        setError("Error fetching payment form");
      }
    } catch (error) {
      message.error("Error fetching payment form.");
      setError("Error fetching payment form");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {paymentInitiated ? (
        <CCAvenuePaymentForm
          encRequest={htmlContent.encRequest}
          accessCode={htmlContent.accessCode}
          link={htmlContent.link}
        />
      ) : (
        <div>{ccerror}</div>
      )}
    </div>
  );
};

export default PaymentComponent;
