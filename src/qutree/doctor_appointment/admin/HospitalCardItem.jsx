import React from "react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const HospitalCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
  padding: theme.spacing(2),
  width: "100%", // Fit within Grid item
  boxSizing: "border-box",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

const AvatarContainer = styled(Box)({
  width: 80,
  height: 80,
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "grey.300",
});

const HospitalCardItem = React.memo(({ hospital, onCardClick }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <HospitalCard ref={ref} onClick={onCardClick}>
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
        >
          <AvatarContainer sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
            {inView && hospital.profilePictureUrl ? (
              <LazyLoadImage
                src={`data:image/png;base64,${hospital.profilePictureUrl}`}
                alt={`${hospital.name} profile`}
                effect="blur"
                width="100%"
                height="100%"
                placeholder={
                  <Box
                    sx={{ width: "100%", height: "100%", bgcolor: "grey.300" }}
                  />
                }
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Typography variant="h6" color="white">
                {hospital.name[0]}
              </Typography>
            )}
          </AvatarContainer>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              {hospital.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              ID: {hospital.id}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, mb: 1 }}
        >
          <strong>Location:</strong> {hospital.location || "N/A"}
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, cursor: "pointer" }}
        >
          <strong>Details:</strong> Click here to preview
        </Typography>
      </CardContent>
    </HospitalCard>
  );
});

export default HospitalCardItem;
