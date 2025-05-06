import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this is correctly installed and imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);

  // Function to handle token expiration and logout
  const handleTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;

      if (timeLeft > 0) {
        setTimeout(() => {
          logout();
          alert("Your session has expired. Please log in again.");
        }, timeLeft);
      } else {
        logout(); // Log out if the token is already expired
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      logout(); // Ensure logout on error
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const email = localStorage.getItem("userEmail");
    const storedRoles = localStorage.getItem("roles");
    const id = localStorage.getItem("userId");
    let roles = [];
    try {
      roles = storedRoles ? JSON.parse(storedRoles) : [];
    } catch (error) {
      console.error("Error parsing roles from localStorage:", error);
    }

    if (token && email && roles.length && id) {
      setJwtToken(token);
      setUserEmail(email);
      setRoles(roles);
      setUserId(id);
      setIsAuthenticated(true);
      handleTokenExpiration(token); // Check for token expiration
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const login = (token, email, userRoles, id) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem(
      "roles",
      JSON.stringify(Array.isArray(userRoles) ? userRoles : [])
    ); // Ensure roles is an array
    localStorage.setItem("userId", id);
    setJwtToken(token);
    setUserEmail(email);
    setRoles(userRoles);
    setUserId(id);
    setIsAuthenticated(true);
    handleTokenExpiration(token); // Set expiration check on login
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("roles");
    localStorage.removeItem("userId");
    setJwtToken(null);
    setUserEmail(null);
    setRoles([]);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        jwtToken,
        userEmail,
        login,
        logout,
        loading,
        roles,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
