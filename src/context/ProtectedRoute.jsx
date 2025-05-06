import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { RolesContext } from "./RoleContext";
import Navbar from "../FixedComponents/Navbar";
import { Spin } from "antd";

const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  const {
    isAuthenticated,
    loading: authLoading,
    jwtToken,
    roles,
  } = useAuth() || {};
  const { loading: rolesLoading } = useContext(RolesContext);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (rolesLoading) {
        setTimeoutReached(true);
        setRedirectToLogin(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [rolesLoading]);

  if (redirectToLogin) {
    return <Navigate to="/oauth/login" replace />;
  }

  if (authLoading || rolesLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !jwtToken || !roles.length) {
    return <Navigate to="/oauth/login" replace />;
  }

  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.some((role) => roles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="layout-container">
      <Navbar />
      <div className="content-container">{element}</div>
    </div>
  );
};
export default ProtectedRoute;
