import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { PaymentContext } from "./PaymentContext";
import { useAuth } from "./AuthContext";
import Navbar from "../FixedComponents/Navbar";
import PaymentModal from "./PaymentModal"; // Import payment modal

const ProtectedPaymentRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, roles, jwtToken } = useAuth();
  const { loading, showPaymentModal } = useContext(PaymentContext);

  if (loading) return <div> <Navbar /></div>;

  if (!isAuthenticated || !jwtToken) {
    return <Navigate to="/oauth/login" replace />;
  }

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(role => roles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="relative">
      <Navbar />
      {showPaymentModal && <PaymentModal />}
      <div className={`content-container ${showPaymentModal ? "opacity-100" : "opacity-100"}`}>
        {element}
      </div>
    </div>
  );
};

export default ProtectedPaymentRoute;
