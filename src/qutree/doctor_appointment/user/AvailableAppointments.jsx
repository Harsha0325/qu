import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  Pagination,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "@axios";
import { toast } from "react-toastify";

// Styled Card for each appointment
const AppointmentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "#fafafa",
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const AvailableAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter states
  const [doctorFilter, setDoctorFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/appointments/available");
        setAppointments(res.data);
        setFilteredAppointments(res.data); // Initially show all
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Error fetching appointments"
        );
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Extract unique values for dropdowns
  const uniqueDoctors = [
    ...new Set(appointments.map((appt) => appt.doctorName)),
  ].sort();
  const uniqueHospitals = [
    ...new Set(appointments.map((appt) => appt.hospitalName)),
  ].sort();
  const uniqueDates = [
    ...new Set(appointments.map((appt) => appt.date)),
  ].sort();

  // Apply filters whenever a filter changes
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...appointments];

      if (doctorFilter) {
        filtered = filtered.filter((appt) => appt.doctorName === doctorFilter);
      }
      if (hospitalFilter) {
        filtered = filtered.filter(
          (appt) => appt.hospitalName === hospitalFilter
        );
      }
      if (dateFilter) {
        filtered = filtered.filter((appt) => appt.date === dateFilter);
      }

      setFilteredAppointments(filtered);
      setPage(0); // Reset to first page when filters change
    };
    applyFilters();
  }, [doctorFilter, hospitalFilter, dateFilter, appointments]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        color="primary"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Available Appointments
      </Typography>

      {/* Filter Dropdowns */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <TextField
          select
          label="Filter by Hospital"
          value={hospitalFilter}
          onChange={(e) => setHospitalFilter(e.target.value)}
          sx={{ minWidth: 200, bgcolor: "grey.50" }}
          SelectProps={{ displayEmpty: true }}
        >
          {uniqueHospitals.map((hospital) => (
            <MenuItem key={hospital} value={hospital}>
              {hospital}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Doctor"
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          sx={{ minWidth: 200, bgcolor: "grey.50" }}
          SelectProps={{ displayEmpty: true }}
        >
          {uniqueDoctors.map((doctor) => (
            <MenuItem key={doctor} value={doctor}>
              {doctor}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          sx={{ minWidth: 200, bgcolor: "grey.50" }}
          SelectProps={{ displayEmpty: true }}
        >
          {uniqueDates.map((date) => (
            <MenuItem key={date} value={date}>
              {date}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading available appointments...
          </Typography>
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No appointments available matching your filters.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedAppointments.map((appt, index) => (
              <Grid item xs={12} key={`${appt.doctorId}-${appt.date}-${index}`}>
                <AppointmentCard>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Hospital
                        </Typography>
                        <Typography variant="body2" color="textPrimary">
                          {appt.hospitalName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {appt.hospitalId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Doctor
                        </Typography>
                        <Typography variant="body2" color="textPrimary">
                          {appt.doctorName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {appt.doctorId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Date
                        </Typography>
                        <Typography variant="body2" color="textPrimary">
                          {appt.date}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Available Time Slots
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {appt.availableTimeSlots.map((slot) => (
                        <Chip
                          key={slot}
                          label={slot}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: "16px" }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </AppointmentCard>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(filteredAppointments.length / rowsPerPage)}
            page={page + 1} // Pagination starts at 1 for user readability
            onChange={(e, newPage) => handleChangePage(e, newPage - 1)} // Adjust to 0-based index
            color="primary"
            sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <TextField
              select
              label="Rows per page"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              size="small"
              sx={{ width: 120 }}
            >
              {[5, 10, 25].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AvailableAppointments;
