import { Navigate } from "react-router-dom";
import { RolesContext } from "./RoleContext";
import { useContext } from "react";
import { useAuth } from "./AuthContext";
import { Spin } from "antd";
import { OAuthContext } from "../qutree/OAuth/OAuthContext";
const AuthRoute = ({ Child }) => {
  const { loading, roles } = useContext(RolesContext);
  const { isAuthenticated } = useAuth();
  const { oauth, loading: oAuthLoading } = useContext(OAuthContext);

  if (loading || oAuthLoading) {
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
  // If the user is not authenticated, render the login page component
  if (!isAuthenticated || oauth.clientId) {
    return <Child />;
  }

  // If the user is authenticated and roles are still empty, return the login page to prevent infinite redirects
  if (roles.length === 0) {
    return <Child />;
  }
  const queryParams = new URLSearchParams(window.location.search);
  const communityId = queryParams.get("communityId");
  // Redirect based on the roles if authenticated
  if (communityId) {
    return <Navigate to={`/join-community?communityId=${communityId}`} />;
  } else if (
    roles.includes("USER") ||
    roles.includes("ADMIN") ||
    roles.includes("AGENT") ||
    roles.includes("SECURITY")
  ) {
    return <Navigate to="/dashboard" />;
  } else if (roles.includes("MASTER_ADMIN")) {
    return <Navigate to="/admin/dashboard" />;
  } else if (roles.includes("CANDIDATE")) {
    return <Navigate to="/candidate/dashboard" />;
  }
  // Default return if no roles matched
  return <Child />;
};

export default AuthRoute;
