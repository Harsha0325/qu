import React, { createContext, useState, useEffect } from "react";
import api from "../qutree/api"; // Assuming api is an Axios instance
import { Base64 } from "js-base64";

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [encodedUserId, setEncodedUserId] = useState(null);
  const [encodedUserQCardId, setEncodedUserQCardId] = useState(null);
  const [formAgent, setFormAgent] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [daysLeftCount, setDaysLeftCount] = useState(null); // Store days left

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const userName = localStorage.getItem("userEmail");

      if (!userName) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/payment-status?userName=${userName}`);
        const data = response.data;

        setPaymentStatus(data.paymentStatus);
        setEncodedUserId(Base64.encode(data.id.toString()));
        setEncodedUserQCardId(Base64.encode(data.userQCardId));
        setFormAgent(data.formAgent);
        setDaysLeftCount(data.daysLeftCount); // Store days left

        // Show modal only if:
        // - Payment is "PENDING" or "FAILED"
        // - AND user is not from an agent
        // - AND daysLeftCount is -1
        if (
          (data.paymentStatus === "PENDING" || data.paymentStatus === "FAILED") &&
          !data.formAgent &&
          data.daysLeftCount === -1
        ) {
          setShowPaymentModal(true);
        }else if((data.paymentStatus === "PENDING" || data.paymentStatus === "FAILED") &&
      data.formAgent) {
          setShowPaymentModal(true);
        } else {
          setShowPaymentModal(false);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, []);

  return (
    <PaymentContext.Provider value={{ 
      loading, 
      paymentStatus, 
      encodedUserId, 
      encodedUserQCardId, 
      formAgent, 
      daysLeftCount,
      showPaymentModal, 
      setShowPaymentModal 
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
