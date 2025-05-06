import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import oauthApi from "../oauthApi";

export const OAuthContext = createContext();
export const OAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [oauth, setOauth] = useState({
    redirectUri: "",
    state: "",
    clientId: "",
    scope: "",
    service: "",
    responseType: "",
  });

  const validateOAuth = async () => {
    setLoading(true);
    const oauthParams = new URLSearchParams(window.location.search);
    const oauthData = {
      service: oauthParams.get("service"),
      redirectUri: oauthParams.get("redirect_uri"),
      state: oauthParams.get("state"),
      clientId: oauthParams.get("client_id"),
      responseType: oauthParams.get("response_type"),
      scope: oauthParams.get("scope"),
    };
    // Use oauthData in setOauth
    if (oauthData.clientId) {
      await clientIdentifier();
      if (localStorage.getItem("jwtToken")) {
        authCodeGenerator();
      } else {
        setLoading(false);
      }
      setOauth(oauthData);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.location.search !== "") {
      validateOAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const clientIdentifier = async () => {
    try {
      const res = await oauthApi.get(
        `/client/identifier${window.location.search}`
      );
      if (res.data == "") {
        navigate(`/oauth/login${window.location.search}`);
      } else {
        window.location.href = res.request.responseURL;
      }
    } catch (err) {
      setLoading(false);
      if (err.response.status === 304) {
        return;
      }

      if (err) {
        setIsError(true);
        console.log(err);
        setLoading(false);
        setErrorCode(err.response.status);
        setErrorMessage("Invalid client identifier");
        navigate(`/oauth/error${window.location.search}`);
      }
    }
  };

  const authCodeGenerator = async () => {
    let redirected = false;
    try {
      setLoading(true);
      const res = await oauthApi.get(`/authorize${window.location.search}`);
      if (res.data == "") {
        navigate(`/oauth/login${window.location.search}`);
      } else {
        window.location.href = res.data;
        redirected = true;
        return;
      }
    } catch (err) {
      if (err) {
        setLoading(false);
        console.log(err.response.status);
        setIsError(true);
        setErrorCode(err.response.status);
        setErrorMessage("Authorization failed");
        navigate(`/oauth/error${window.location.search}`);
      }
    } finally {
      if (!redirected) setLoading(false);
    }
  };

  const values = {
    oauth,
    authCodeGenerator,
    isError,
    validateOAuth,
    errorMessage,
    errorCode,
    loading,
    setLoading,
  };

  return (
    <OAuthContext.Provider value={values}>{children}</OAuthContext.Provider>
  );
};

export default OAuthProvider;
