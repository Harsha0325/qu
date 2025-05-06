import React, { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import CommunityForm from "./CommunityForm";
import { RolesContext } from "../../context/RoleContext";
import { useMediaQuery, useTheme } from "@mui/material";

const CreateCommunityForm = () => {
  const { jwtToken } = useAuth() || {};
  const { userId } = useContext(RolesContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="bg-white md:ml-64 lg:ml-20">
      <CommunityForm userId={userId} jwtToken={jwtToken} isMobile={isMobile} />
    </div>
  );
};

export default CreateCommunityForm;
