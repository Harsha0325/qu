import React, { useContext } from "react";
import { OAuthContext } from "./OAuthContext";

const OAuthAuthorizationCode = () => {
  const oauth = useContext(OAuthContext);
  console.log(oauth);

  return <div className="bg bg-blue-500">OAuthAuthorizationCode</div>;
};

export default OAuthAuthorizationCode;
