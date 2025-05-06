import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";

function TimeSlotsByDoctor() {
  const [doctorId, setDoctorId] = useState("1");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      toast.error("Please enter a Doctor ID!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/appointments/doctor/${doctorId}/slots`);
      setSlots(res.data);
      toast.success("Doctor availability fetched successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Doctor Availability
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Doctor ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Get Availability"}
            </Button>
          </Grid>
        </Grid>
      </form>
      {slots.length > 0 && (
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Available Slots</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.map((slot, index) => (
              <TableRow key={index}>
                <TableCell>{slot.date}</TableCell>
                <TableCell>{slot.availableTimeSlots.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

export default TimeSlotsByDoctor;
