import React, { useEffect, useState } from "react";
import axios from "@axios";
import {
  Modal,
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import BookAppointmentForm from "./BookAppointmentForm";
import { estimatedRoadDistanceByHaversineStraightLine } from "../../../utils/getDistance";

const BookingModal = ({
  open,
  onClose,
  step,
  selectedHospital,
  selectedDoctor,
  onHospitalSelect,
  onDoctorSelect,
  refreshAppointments,
  userId,
}) => {
  const [hospitalsData, setHospitalsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState({});
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (open) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, [open]);

  useEffect(() => {
    if (open && userCoords) {
      axios
        .get("/hospitals/all")
        .then((response) => {
          const sortedHospitals = response.data
            .map((hospital) => {
              const { realisticDistance } =
                estimatedRoadDistanceByHaversineStraightLine(
                  userCoords.lat,
                  userCoords.lon,
                  hospital.latitude,
                  hospital.longitude
                );
              return { ...hospital, distance: `${realisticDistance} km` };
            })
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
          setHospitalsData(sortedHospitals);
        })
        .catch((error) => console.error("Error fetching hospitals:", error));
    }
  }, [open, userCoords]);

  useEffect(() => {
    if (selectedHospital?.id) {
      axios
        .get(`/doctors/all/by-hospital-id/${selectedHospital?.id}`)
        .then((response) =>
          setDoctorsData((prev) => ({
            ...prev,
            [selectedHospital?.id]: response.data,
          }))
        )
        .catch((error) => console.error("Error fetching doctors:", error));
    }
  }, [selectedHospital]);

  const handleClose = () => {
    onClose();
    onHospitalSelect(null);
    onDoctorSelect(null);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600, md: 900 },
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "white",
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {step === "hospital" && (
          <>
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              align="center"
            >
              Step 1: Select a Hospital
            </Typography>
            <Grid container spacing={3}>
              {hospitalsData.map((hospital) => (
                <Grid item xs={12} sm={6} md={4} key={hospital?.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      "&:hover": { boxShadow: 6, bgcolor: "grey.100" },
                    }}
                    onClick={() => onHospitalSelect(hospital)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      sx={{ aspectRatio: "16/9", objectFit: "cover" }}
                      image={
                        hospital?.profilePictureUrl
                          ? `data:image/jpeg;base64,${hospital?.profilePictureUrl}`
                          : "/default-hospital.jpg"
                      }
                      alt={hospital?.name || "Hospital Image"}
                    />
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          src={
                            hospital?.profilePictureUrl
                              ? `data:image/jpeg;base64,${hospital?.profilePictureUrl}`
                              : undefined
                          }
                          sx={{ width: 40, height: 40, mr: 2 }}
                        >
                          {hospital?.name[0]}
                        </Avatar>
                        <Typography variant="h6" color="primary">
                          {hospital?.name}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        Distance: {hospital?.distance || "Unknown"}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        Location: {hospital?.location || "N/A"}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        Pincode: {hospital?.pincode || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {step === "doctor" && (
          <>
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              align="center"
            >
              Step 2: Select a Doctor - {selectedHospital?.name}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => onHospitalSelect(null)}
              sx={{ mb: 2, display: "block", mx: "auto", borderRadius: 1 }}
            >
              Back to Hospitals
            </Button>
            <Grid container spacing={3}>
              {(doctorsData[selectedHospital?.id] || []).map((doctor) => (
                <Grid item xs={12} sm={6} md={4} key={doctor?.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      "&:hover": { boxShadow: 6, bgcolor: "grey.100" },
                    }}
                    onClick={() => onDoctorSelect(doctor)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      sx={{ aspectRatio: "16/9", objectFit: "cover" }}
                      image={
                        doctor.profilePictureUrl
                          ? `data:image/jpeg;base64,${doctor?.profilePictureUrl}`
                          : "/default-doctor.jpg"
                      }
                      alt={doctor?.name || "Doctor Image"}
                    />
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          src={
                            doctor.profilePictureUrl
                              ? `data:image/jpeg;base64,${doctor?.profilePictureUrl}`
                              : undefined
                          }
                          sx={{ width: 40, height: 40, mr: 2 }}
                        >
                          {doctor?.name[0]}
                        </Avatar>
                        <Typography variant="h6" color="primary">
                          Dr. {doctor?.name}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        Specialization:{" "}
                        {doctor?.specialization?.join(", ") || "General"}
                      </Typography>
                      {/* <Typography variant="subtitle1" color="text.secondary">
                        Experience: {doctor?.experience || "N/A"} years
                      </Typography> */}
                      <Typography variant="subtitle1" color="text.secondary">
                        Phone: {doctor?.phoneNumber || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {step === "form" && (
          <BookAppointmentForm
            onClose={handleClose}
            hospital={selectedHospital}
            doctor={selectedDoctor}
            userId={userId}
            refreshAppointments={refreshAppointments}
            userCoords={userCoords}
          />
        )}
      </Box>
    </Modal>
  );
};

export default BookingModal;
