import React, { createContext, useEffect, useState } from "react";
import Api from "../qutree/BaseUrlAPI";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode"; // Make sure this is imported correctly

export const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null); // Added email state
  const [loading, setLoading] = useState(true);

  const { jwtToken } = useAuth() || {}; // Get the token from the AuthContext

  useEffect(() => {
    const fetchRoles = async () => {
      if (!jwtToken) {
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(jwtToken);
        const id = decodedToken.id;
        const userEmail = decodedToken.sub;

        if (!id || !userEmail) {
          console.error("User ID or email not found in token");
          setLoading(false);
          return;
        }

        setUserId(id);
        setEmail(userEmail);

        // Fetch roles based on the userId
        const response = await Api.get(`/${userEmail}/roles`);
        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data); // Ensure roles are set before navigation
        } else {
          console.error("Roles response is not valid");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    if (jwtToken) {
      fetchRoles();
    } else {
      setLoading(false);
    }
  }, [jwtToken]);

  const value = {
    roles,
    userId,
    email, // Added email to the context value
    loading,
  };

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
};

export default RolesProvider;
