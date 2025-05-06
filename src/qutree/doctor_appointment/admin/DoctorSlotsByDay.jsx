import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";

function DoctorSlotsByDay() {
  const [doctorId, setDoctorId] = useState("1");
  const [date, setDate] = useState("2025-02-21");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date) {
      toast.error("Please enter Doctor ID and Date!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `/appointments/doctor/${doctorId}/day?date=${date}`
      );
      setSlots(res.data);
      toast.success("Slots fetched successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, maxWidth: 600, mx: "auto", boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Doctor Slots by Day
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
          <Grid item xs={12}>
            <TextField
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Get Slots"}
            </Button>
          </Grid>
        </Grid>
      </form>
      {slots.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" align="center">
            Available Slots
          </Typography>
          <List>
            {slots.map((slot, index) => (
              <ListItem key={index} sx={{ justifyContent: "center" }}>
                {slot}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Card>
  );
}

export default DoctorSlotsByDay;
