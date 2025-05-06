import React from "react";
import { Route, Routes } from "react-router-dom";
import OAuthError from "./OAuthError";
import Login from "../HomeComponents/Login";
import SignUpWeb from "../UserRegister/SignUpWeb";
import OAuthProvider from "./OAuthContext";
import AuthRoute from "../../context/AuthRoute";
// import OAuthAuthorizationCode from "./OAuthAuthorizationCode";

function Oauth() {
  return (
    <OAuthProvider>
      <Routes>
        <Route path="/login" element={<AuthRoute Child={Login} />} />
        <Route path="/signup" element={<SignUpWeb />} />
        <Route path="/error" element={<OAuthError />} />
        {/* <Route path="/authCode" element={<OAuthAuthorizationCode />} /> */}
      </Routes>
    </OAuthProvider>
  );
}

export default Oauth;
