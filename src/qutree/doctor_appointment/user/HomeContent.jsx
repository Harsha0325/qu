import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(2),
  backgroundColor: "#fff",
  overflow: "hidden",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  fontSize: "0.95rem",
  borderRadius: theme.spacing(1),
  borderWidth: 2,
  "&:hover": {
    borderWidth: 2,
    backgroundColor: theme.palette.primary.light,
    color: "#fff",
  },
}));

const HomeContent = ({ onViewChange }) => (
  <Box
    sx={{
      maxWidth: "800px", // Wider for more content
      mx: "auto",
      my: { xs: 2, md: 4 },
      zIndex: 10, // Above Banner
    }}
  >
    <StyledCard>
      <CardContent
        sx={{
          p: { xs: 2, sm: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
            letterSpacing: "-0.5px",
          }}
        >
          Your Healthcare Hub
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            mb: 2,
            fontWeight: 400,
          }}
        >
          Streamline your medical journey with ease and confidence.
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            mb: 3,
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Discover a seamless way to connect with top healthcare professionals,
          schedule appointments, and manage your health records—all in one
          place. Take control of your wellness today with our intuitive portal.
        </Typography>
        <Divider
          sx={{
            mb: 3,
            mx: "auto",
            width: "80px",
            borderColor: "primary.main",
            borderWidth: "2px",
          }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          spacing={2}
        >
          {/* <ActionButton
            variant="outlined"
            color="primary"
            onClick={() => onViewChange("available")}
          >
            Explore Available Appointments
          </ActionButton> */}
          <ActionButton
            variant="outlined"
            color="primary"
            onClick={() => onViewChange("myAppointments")}
          >
            View My Appointments
          </ActionButton>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
            fontStyle: "italic",
          }}
        >
          Need help? Contact our support team anytime.
        </Typography>
      </CardContent>
    </StyledCard>
  </Box>
);

export default HomeContent;
