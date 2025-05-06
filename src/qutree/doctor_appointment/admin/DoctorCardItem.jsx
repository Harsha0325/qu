import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";

const DoctorCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
  padding: theme.spacing(2),
  minWidth: "260px",
  maxWidth: "360px",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    minWidth: "220px",
    maxWidth: "100%",
  },
}));

const DoctorCardItem = React.memo(({ doctor, onCardClick }) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const onAppointmentClick = () => {
    // Navigate to the doctor's appointments page with doctor ID
    navigate(`/doctor/${doctor.id}/appointments`);
  };

  return (
    <DoctorCard>
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
          }}
          ref={ref}
          onClick={onCardClick}
        >
          {inView && doctor.profilePictureUrl ? (
            <LazyLoadImage
              src={`data:image/png;base64,${doctor.profilePictureUrl}`}
              alt={`${doctor.name} profile`}
              effect="blur"
              width="60"
              height="60"
              placeholder={
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "grey.300",
                    borderRadius: "50%",
                  }}
                />
              }
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: { xs: "0", sm: "16px" },
                marginBottom: { xs: "8px", sm: "0" },
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                mr: { xs: 0, sm: 2 },
                mb: { xs: 1, sm: 0 },
                borderRadius: "50%",
                bgcolor: "grey.300",
              }}
            >
              {doctor.name[0]}
            </Avatar>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              Dr. {doctor.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              ID: {doctor.id}
            </Typography>
          </Box>
        </Box>
        <Box ref={ref} onClick={onCardClick}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, mb: 1 }}
          >
            <strong>Hospital:</strong> {doctor.hospitalName} (ID:{" "}
            {doctor.hospitalId})
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              cursor: "pointer",
            }}
          >
            <strong>Address:</strong>{" "}
            {doctor.address || "Click here to preview details"}
          </Typography>
        </Box>

        <Button
          onClick={onAppointmentClick}
          variant="contained"
          color="primary"
        >
          View Appointments
        </Button>
      </CardContent>
    </DoctorCard>
  );
});

export default DoctorCardItem;
