import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";
import { estimatedRoadDistanceByHaversineStraightLine } from "../../../utils/getDistance";

const BookAppointmentForm = ({
  onClose,
  hospital,
  doctor,
  userId,
  refreshAppointments,
  userCoords,
}) => {
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleBookAppointment = async () => {
    setLoading(true);
    try {
      const payload = {
        userId,
        doctorId: doctor.id,
        hospitalId: hospital.id,
        date: appointmentData.date,
        reason: appointmentData.reason,
      };
      await axios.post("/appointments", payload);
      toast.success("Token requested successfully!");
      refreshAppointments();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error requesting token");
    } finally {
      setLoading(false);
    }
  };

  const distance = userCoords
    ? estimatedRoadDistanceByHaversineStraightLine(
        userCoords.lat,
        userCoords.lon,
        hospital.latitude,
        hospital.longitude
      ).realisticDistance
    : "Unknown";

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color="primary" gutterBottom align="center">
        Request Your Token
      </Typography>

      <Card sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "grey.50" }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Selected Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={
                hospital.profilePictureUrl
                  ? `data:image/jpeg;base64,${hospital.profilePictureUrl}`
                  : undefined
              }
              sx={{ width: 48, height: 48, mr: 2 }}
            >
              {hospital.name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">{hospital.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Distance: {distance} km
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Location: {hospital.location || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={
                doctor.profilePictureUrl
                  ? `data:image/jpeg;base64,${doctor.profilePictureUrl}`
                  : undefined
              }
              sx={{ width: 48, height: 48, mr: 2 }}
            >
              {doctor.name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">Dr. {doctor.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Specialization: {doctor.specialization?.join(", ") || "General"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Token Request Details
      </Typography>
      <TextField
        label="Date"
        type="date"
        value={appointmentData.date}
        onChange={(e) =>
          setAppointmentData({ ...appointmentData, date: e.target.value })
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2, bgcolor: "grey.50" }}
        inputProps={{ min: new Date().toISOString().split("T")[0] }}
      />
      <TextField
        label="Reason for Visit"
        value={appointmentData.reason}
        onChange={(e) =>
          setAppointmentData({ ...appointmentData, reason: e.target.value })
        }
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2, bgcolor: "grey.50" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleBookAppointment}
        disabled={loading || !appointmentData.date || !appointmentData.reason}
        fullWidth
        sx={{ py: 1, borderRadius: 1, "&:hover": { bgcolor: "primary.dark" } }}
      >
        {loading ? <CircularProgress size={24} /> : "Request Token"}
      </Button>
    </Box>
  );
};

export default BookAppointmentForm;
