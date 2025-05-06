import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import axios from "@axios";
import { useAuth } from "../../../context/AuthContext";

const ViewAppointments = () => {
  const { userId } = useAuth() || {};
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/appointments/user", {
          params: { userId: userId },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter((a) => a.id !== appointmentId));
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Appointments:
      </Typography>
      <List>
        {appointments.map((appointment) => (
          <ListItem key={appointment.id}>
            <ListItemText
              primary={`${appointment.doctor.name} - ${appointment.startTime}`}
              secondary={appointment.doctor.specialization}
            />
            <Button
              onClick={() => handleCancel(appointment.id)}
              color="secondary"
            >
              Cancel
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ViewAppointments;
