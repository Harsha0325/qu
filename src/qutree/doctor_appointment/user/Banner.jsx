import React from "react";
import { Box, Typography, createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Button } from "antd";
import { motion } from "framer-motion";

// Define futuristic theme
const theme = createTheme({
  palette: {
    primary: { main: "#00b4d8" }, // Vibrant cyan for a futuristic feel
    secondary: { main: "#ff4081" }, // Bright pink accent
    background: { default: "#0d1b2a" }, // Dark blue-gray base
  },
  typography: {
    fontFamily: "'Orbitron', 'Roboto', sans-serif", // Futuristic font
    h2: { fontWeight: 700, letterSpacing: "1px" },
    body1: { fontSize: "1.2rem", lineHeight: 1.5, fontWeight: 300 },
  },
});

// Styled components
const BannerContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: { xs: "50vh", sm: "60vh", md: "70vh" },
  minHeight: { xs: 250, sm: 300, md: 350 },
  width: "100%",
  maxWidth: 1440,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #1b263b 100%)`, // Dark futuristic gradient
  boxShadow: "0 0 20px rgba(0, 180, 216, 0.3)", // Glowing edge
}));

const BannerImage = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  opacity: 0.6, // Reduced for subtlety
  // zIndex: 0,
  filter: "contrast(1.1) brightness(0.9)", // Enhance image vibrance
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(145deg, rgba(0, 180, 216, 0.2), rgba(0, 0, 0, 0.7))",
  // zIndex: 0.01,
}));

const ContentBox = styled(motion.div)(({ theme }) => ({
  position: "relative",
  textAlign: "center",
  color: "#fff",
  padding: theme.spacing(3),
  // zIndex: 0.2,
  width: "100%",
  maxWidth: { xs: "90%", sm: "600px", md: "800px" },
}));

const FuturisticButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  borderRadius: "30px",
  padding: "10px 28px",
  fontSize: "1rem",
  fontWeight: 600,
  fontFamily: "'Orbitron', sans-serif",
  color: "#fff",
  boxShadow: "0 0 15px rgba(255, 64, 129, 0.5)", // Glowing effect
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    transform: "scale(1.1)",
    boxShadow: "0 0 25px rgba(255, 64, 129, 0.8)",
  },
}));

const Banner = ({ onBookClick }) => (
  <Box>
    {/* <BannerImage
      component="img"
      src="/doctor_appointment/doc_appointment_banner.png"
      alt="Healthcare Banner"
    /> */}
    <Overlay />
    <ContentBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.25rem" },
            textShadow: "0 0 10px rgba(0, 180, 216, 0.7)", // Neon glow
            color: "#fff",
          }}
        >
          QUICKY NET - Healthcare
        </Typography>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
            mb: { xs: 2, sm: 3, md: 4 },
            color: "rgba(255, 255, 255, 0.9)",
            textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
          }}
        >
          Book cutting-edge appointments with top professionals effortlessly.
        </Typography>
      </motion.div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <FuturisticButton type="primary" size="large" onClick={onBookClick}>
          Book Now
        </FuturisticButton>
      </motion.div>
    </ContentBox>
  </Box>
);

export default Banner;
