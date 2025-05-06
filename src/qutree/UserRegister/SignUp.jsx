import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { MuiTelInput } from "mui-tel-input";

const SignUp = ({
  isMobile,
  oauth,
  renderLabel,
  fullName,
  handleInputChange,
  setFullName,
  errors,
  phoneNumber,
  setPhoneNumber,
  userName,
  setUserName,
  setErrors,
  showPassword,
  password,
  setPassword,
  handlePasswordVisibility,
  showConfirmPassword,
  confirmPassword,
  setConfirmPassword,
  handleConfirmPasswordVisibility,
  loading,
  handleFormSubmit,
  navigate,
  queryParams,
}) => {
  return (
    <Grid
      className={`flex  justify-center h-screen overflow-y-scroll ${
        isMobile ? "p-1 w-full overflow-x-hidden" : "w-[40%] items-center"
      } `}
      style={{
        background:
          "linear-gradient(120deg, rgba(27, 51, 81, 1) 40.11%, rgba(36, 6, 33, 1) 102.2%)",
        strokeWidth: "1px",
        stroke: "rgba(51, 66, 255, 0)",
        backdropFilter: "blur(50px)",
      }}
    >
      <Grid className="max-w-[550px]">
        <div className="flex flex-col w-full  p-10 rounded-lg">
          <Grid container justifyContent="left">
            <section className="flex flex-col w-full  text-white mb-[32px]">
              <header className="flex flex-col w-full">
                <h1 className="text-3xl font-semibold leading-none">
                  {`Sign Up ${oauth.service ? `to ${oauth.service} ` : ""}`}
                </h1>
                <p className="mt-3 text-base">
                  Welcome back! Please enter your details.
                </p>
              </header>
            </section>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                {renderLabel("Full Name")}
                <TextField
                  id="fullName"
                  name="fullName"
                  variant="outlined"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) =>
                    handleInputChange(setFullName, "fullName", e.target.value)
                  }
                  error={!!errors.fullName}
                  InputProps={{
                    style: {
                      borderRadius: "5px",
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                  InputLabelProps={{
                    style: { display: "none" },
                  }}
                />
                {errors.fullName && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.fullName}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                {renderLabel("Phone Number")}
                <MuiTelInput
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(value) =>
                    handleInputChange(setPhoneNumber, "phoneNumber", value)
                  }
                  required
                  defaultCountry="IN"
                  variant="outlined"
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    backgroundColor: "white",
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                />
                {errors.phoneNumber && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.phoneNumber}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                {renderLabel("Email")}
                <TextField
                  id="userName"
                  name="userName"
                  variant="outlined"
                  placeholder="Email"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) {
                      setErrors((prevErrors) => {
                        const { userName, ...remainingErrors } = prevErrors;
                        return remainingErrors;
                      });
                    }
                  }}
                  error={!!errors.userName}
                  InputProps={{
                    style: {
                      borderRadius: "5px",
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                  InputLabelProps={{
                    style: { display: "none" },
                  }}
                />
                {errors.userName && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.userName}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                {renderLabel("Password")}
                <TextField
                  id="password"
                  name="password"
                  variant="outlined"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password || errors.confirmPassword) {
                      setErrors((prevErrors) => {
                        const {
                          password,
                          confirmPassword,
                          ...remainingErrors
                        } = prevErrors;
                        return remainingErrors;
                      });
                    }
                  }}
                  error={!!errors.password}
                  InputProps={{
                    style: {
                      borderRadius: "5px",
                      backgroundColor: "white",
                      color: "black",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlined className="text-gray-600" />
                          ) : (
                            <VisibilityOutlined className="text-gray-600" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { display: "none" },
                  }}
                />
                {errors.password && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.password}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                {renderLabel("Confirm Password")}
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  variant="outlined"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prevErrors) => {
                        const { confirmPassword, ...remainingErrors } =
                          prevErrors;
                        return remainingErrors;
                      });
                    }
                  }}
                  error={!!errors.confirmPassword}
                  InputProps={{
                    style: {
                      borderRadius: "5px",
                      backgroundColor: "white",
                      color: "black",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffOutlined className="text-gray-600" />
                          ) : (
                            <VisibilityOutlined className="text-gray-600" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { display: "none" },
                  }}
                />
                {errors.confirmPassword && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                fullWidth
                className="mt-8 py-4 text-white text-base font-medium bg-gradient-to-r from-[#066882] to-[#066882] hover:from-[#066882] hover:to-[#066882]"
                disabled={loading}
                onClick={handleFormSubmit}
                style={{ padding: "15px" }}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12} style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#FCFAF6",
                }}
              >
                <Typography variant="body2" style={{ marginRight: "4px" }}>
                  Already have an account?
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#06B3E4", cursor: "pointer" }}
                  onClick={() => navigate(`/oauth/login?${queryParams}`)}
                >
                  Sign In
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignUp;
