import React, { useContext, useEffect } from "react";
import ErrorLayout from "../../OauthErrorScreen/ErrorLayout";
import { OAuthContext } from "./OAuthContext";
import { Spin } from "antd";

function OAuthError() {
  const { isError, errorMessage, validateOAuth, errorCode } =
    useContext(OAuthContext);

  useEffect(() => {
    if (!isError) {
      validateOAuth();
    }
  }, [isError, validateOAuth]);

  if (errorMessage === "") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return <ErrorLayout errorMessage={errorMessage} errorCode={errorCode} />;
}

export default OAuthError;
