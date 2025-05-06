import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import Api from "../BaseUrlAPI";
import { OAuthContext } from "../OAuth/OAuthContext";
import InfoLeftContainer from "../OAuth/InfoLeftContainer";
import { Spin } from "antd";

const Login = () => {
  const { oauth, authCodeGenerator, loading, setLoading } =
    useContext(OAuthContext);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the auth context
  const [username, setusername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setusernameError] = useState(false); // Changed from emailError to usernameError
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const queryParams = new URLSearchParams(window.location.search);
  const validateForm = () => {
    let valid = true;
    if (username.trim() === "") {
      setusernameError(true); // Changed from emailError to usernameError
      valid = false;
    } else {
      setusernameError(false); // Changed from emailError to usernameError
    }
    if (password.trim() === "") {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLocalLoading(true);

    const loginData = { username, password };

    try {
      const response = await Api.post("/authenticate", loginData);

      if (response.status === 200) {
          setLocalLoading(false);
        const { jwtToken, username, roles, userId } = response.data;
        const communityId = queryParams.get("communityId");

        await login(jwtToken, username, roles, userId);
        if (oauth.service && oauth.service != "") {
          // navigate(`/oauth/authCode${window.location.search}`);
          localStorage.setItem("jwtToken", jwtToken);
          authCodeGenerator();
        } else if (communityId) {
          navigate(`/join-community${window.location.search}`);
        } else {
          navigateBasedOnRoles(roles); // Separate navigation logic
        }
      } else {
        setLocalLoading(false)
        setLoginError("Login failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setLocalLoading(false)
      handleLoginError(error);
    }
  };

  const navigateBasedOnRoles = (roles) => {
    if (roles.includes("MASTER_ADMIN")) {
      navigate("/admin/dashboard");
    } else if (
      roles.includes("USER") ||
      roles.includes("ADMIN") ||
      roles.includes("AGENT") ||
      roles.includes("SECURITY")
    ) {
      navigate("/dashboard");
    } else if (roles.includes("CANDIDATE")) {
      navigate("/candidate/dashboard");
    } else {
      setLoginError("Unauthorized access.");
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      if (error.response.status === 502) {
        setLoginError("Bad Gateway: The server is temporarily unavailable. Please try again later.");
      } else if (error.response.status === 504) {
        setLoginError("Gateway Timeout: The server took too long to respond. Please try again shortly.");
      } else {
        const { data } = error.response;
        setLoginError(data);
      }
    } else {
      setLoginError("An error occurred. Please check your connection.");
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen ">
      <Spin size="large" />
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen max-w-screen overflow-hidden">
      {isMobile ? <></> : <InfoLeftContainer />}
      <Grid
        className={`flex justify-center min-h-screen overflow-y-auto ${isMobile ? "p-1 w-full" : "w-[40%] p-4 items-center"
          } `}
        style={{
          background:
            "linear-gradient(120deg, rgba(27, 51, 81, 1) 40.11%, rgba(36, 6, 33, 1) 102.2%)",
          strokeWidth: "1px",
          stroke: "rgba(51, 66, 255, 0)",
          backdropFilter: "blur(50px)",
        }}
      >
        <Grid item xs={12} sm={8} md={6} lg={5} style={{ maxWidth: "550px" }}>
          <div className="flex flex-col w-full p-10 rounded-lg">
            <Grid container justifyContent="left">
              <section className="flex flex-col w-full  text-white mb-[32px]">
                <header className="flex flex-col w-full">
                  <h1 className="text-3xl font-semibold leading-none">
                    {`Log in to continue ${oauth.service ? `to ${oauth.service} ` : "your account"
                      }`}
                  </h1>
                  <p className="mt-3 text-base">
                    Welcome back! Please enter your details.
                  </p>
                </header>
              </section>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    id="username"
                    name="username"
                    label="Email *"
                    variant="filled"
                    autoFocus
                    autoComplete="email" // Corrected autoComplete attribute
                    value={username}
                    error={usernameError}
                    helperText={usernameError ? "Email is required" : ""}
                    InputLabelProps={{
                      style: { color: "#677379" }, // Label color
                    }}
                    InputProps={{
                      style: {
                        color: "black", // Text color
                        backgroundColor: "white", // Input background color
                        border: "1px solid white", // Input border color
                      },
                    }}
                    FormHelperTextProps={{
                      style: { color: "#677379", margin: 0, padding: 0 }, // Helper text style
                    }}
                    onChange={(e) => {
                      setusername(e.target.value);
                      setusernameError(false);
                    }}
                    sx={{
                      "& .MuiFilledInput-root": {
                        backgroundColor: "white",
                        border: "1px solid white",
                        borderRadius: "4px", // Optional, for rounded corners
                      },
                      "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                      {
                        borderBottom: "none", // Remove the default underline
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    id="password"
                    name="password"
                    label="Password *"
                    variant="filled"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    error={passwordError}
                    helperText={passwordError ? "Password is required" : ""}
                    InputLabelProps={{
                      style: { color: "#677379" }, // Label text color
                    }}
                    FormHelperTextProps={{
                      style: { color: "#677379", margin: 0, padding: 0 }, // Helper text color
                    }}
                    InputProps={{
                      style: { color: "#677379" }, // Input text color
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handlePasswordVisibility}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? (
                              <VisibilityOffOutlined
                                sx={{ color: "#677379" }}
                              />
                            ) : (
                              <VisibilityOutlined sx={{ color: "#677379" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiFilledInput-root": {
                        backgroundColor: "white", // Default background color
                        border: "1px solid white", // Input border color
                        borderRadius: "4px", // Optional: Adds rounded corners
                      },
                      "& .MuiFilledInput-root:hover": {
                        backgroundColor: "white", // Background color on hover
                      },
                      "& .MuiFilledInput-root.Mui-focused": {
                        backgroundColor: "white", // Background color on focus
                      },
                      "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                      {
                        borderBottom: "none", // Remove the default underline
                      },
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  marginBottom: "4px",
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <div
                  style={{ color: "#06B3E4", cursor: "pointer" }}
                  onClick={() => navigate(`/forgot-password${location.search}`)}
                >
                  Forgot password ?
                </div>
              </Grid>
              <Grid item xs={12} style={{ marginBottom: "16px" }}></Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  className="mt-8 py-4 text-white text-base font-medium bg-gradient-to-r from-[#066882] to-[#066882] hover:from-[#066882] hover:to-[#066882]"
                  disabled={localLoading}
                  onClick={handleSubmit}
                  style={{ padding: "15px" }}
                >
                  Log in
                </Button>
              </Grid>

              {loginError && (
                <Grid item xs={12} style={{ marginTop: "16px" }}>
                  <Typography color="error">{loginError}</Typography>
                </Grid>
              )}
              <Grid item xs={12} style={{ marginTop: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#FCFAF6",
                  }}
                >
                  <Typography variant="body2" style={{ marginRight: "4px" }}>
                    Don’t have an account?
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: "#06B3E4", cursor: "pointer" }}
                    onClick={() => navigate(`/oauth/signup?${queryParams}`)}
                  >
                    Sign up
                  </Typography>
                </div>

                {isMobile && (<div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#FCFAF6",
                    marginTop: "20px",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{ color: "#06B3E4", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                  </Typography>
                </div>)}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
