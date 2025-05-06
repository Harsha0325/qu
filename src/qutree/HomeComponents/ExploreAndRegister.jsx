import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExploreAndRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {  
    navigate(`/oauth/signup`);
  }, [navigate]);

  return <div></div>;
};

export default ExploreAndRegister;
