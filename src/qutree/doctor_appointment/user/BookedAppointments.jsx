import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Pagination,
  Divider,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AccessTime,
  Schedule,
  CheckCircle,
  PersonPinCircle,
  DoneAll,
  Cancel,
} from "@mui/icons-material";

const AppointmentCard = styled(Card)(({ theme, isPast }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: isPast ? "grey.100" : "white",
  border: isPast ? "1px solid" : "none",
  borderColor: "grey.300",
  boxShadow: isPast
    ? "0 2px 4px rgba(0, 0, 0, 0.05)"
    : "0 4px 12px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: isPast ? "none" : "translateY(-4px)",
    boxShadow: isPast
      ? "0 2px 6px rgba(0, 0, 0, 0.1)"
      : "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
  transition: "transform 0.2s, box-shadow 0.2s",
}));

const BookedAppointments = ({
  appointments,
  loading,
  page,
  itemsPerPage,
  onPageChange,
}) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [showQr, setShowQr] = useState(null);

  const calculateElapsedTime = (appointmentDate) => {
    const now = new Date();
    const booked = new Date(appointmentDate);
    const diffMs = now - booked;
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 0) return `${-diffMins} min until`;
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const isPastAppointment = (date) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    return now > appointmentDate.setDate(appointmentDate.getDate() + 1); // Past if > 1 day after
  };
  const sortedAppointments = [...appointments].sort((a, b) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Check if past (before today)
    const isPastA = dateA < today;
    const isPastB = dateB < today;

    // Prioritize current/future (date >= today) over past
    if (!isPastA && isPastB) return -1; // A is current/future, B is past -> A first
    if (isPastA && !isPastB) return 1; // A is past, B is current/future -> B first

    // If both are in the same group (both past or both current/future), sort by date
    const dateComparison = dateA - dateB;
    if (dateComparison !== 0) return dateComparison;

    // If dates are equal, sort by tokenNumber
    return a.tokenNumber - b.tokenNumber;
  });
  const paginatedAppointments = sortedAppointments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleMouseEnter = (id) => {
    setHoveredId(id);
    const timer = setTimeout(() => {
      if (hoveredId === id) setShowQr(id);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setShowQr(null);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "requested":
        return <Schedule />;
      case "accepted":
        return <CheckCircle />;
      case "arrived":
        return <PersonPinCircle />;
      case "completed":
        return <DoneAll />;
      case "cancelled":
        return <Cancel />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: 4,
        px: { xs: 2, md: 0 },
        bgcolor: "grey.50",
        borderRadius: 3,
        minHeight: "80vh",
      }}
    >
      <Typography
        variant="h4"
        color="primary.main"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        My Booked Tokens
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: "text.secondary", fontStyle: "italic" }}
          >
            Loading your tokens...
          </Typography>
        </Box>
      ) : appointments.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            No tokens booked yet.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedAppointments.map((appt) => {
              const isPast = isPastAppointment(appt.date);
              const isCancelled = appt.status.toLowerCase() === "cancelled";

              return (
                <Grid item xs={12} sm={6} md={4} key={appt.id}>
                  <AppointmentCard
                    isPast={isPast}
                    onMouseEnter={() => handleMouseEnter(appt.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={`data:image/jpeg;base64,${appt.qrCodeImage}`}
                          alt="QR Code"
                          sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: isPast ? "grey.700" : "text.primary",
                            }}
                          >
                            Dr. {appt.doctorName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={isPast ? "grey.600" : "text.secondary"}
                          >
                            ID: {appt.doctorId}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography
                        variant="body1"
                        color={isPast ? "grey.600" : "text.secondary"}
                        sx={{ mb: 1 }}
                      >
                        <strong>Hospital:</strong> {appt.hospitalName} (ID:{" "}
                        {appt.hospitalId})
                      </Typography>
                      <Typography
                        variant="body1"
                        color={isPast ? "grey.600" : "text.secondary"}
                        sx={{ mb: 1 }}
                      >
                        <strong>Date:</strong> {appt.date}
                      </Typography>
                      <Typography
                        variant="body1"
                        color={isPast ? "grey.600" : "text.secondary"}
                        sx={{ mb: 1 }}
                      >
                        <strong>Token Number:</strong> {appt.tokenNumber}
                      </Typography>
                      <Typography
                        variant="body1"
                        color={isPast ? "grey.600" : "text.secondary"}
                        sx={{ mb: 2 }}
                      >
                        <strong>Status:</strong>{" "}
                        <Chip
                          icon={getStatusIcon(appt.status)}
                          label={appt.status}
                          variant="outlined"
                          size="small"
                          sx={{
                            ml: 1,
                            borderRadius: "12px",
                            ...(isPast
                              ? {
                                  color: "grey.500",
                                  borderColor: "grey.400",
                                  bgcolor: "transparent",
                                }
                              : isCancelled
                              ? {
                                  color: "error.main",
                                  borderColor: "error.main",
                                }
                              : {
                                  color: "success.main",
                                  borderColor: "success.main",
                                }),
                          }}
                        />
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          icon={<AccessTime />}
                          label={calculateElapsedTime(appt.date)}
                          color={isPast ? "default" : "info"}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: "12px" }}
                        />
                      </Box>
                      {showQr === appt.id && !isPast && (
                        <Box sx={{ mt: 2 }}>
                          <Avatar
                            src={`data:image/jpeg;base64,${appt.qrCodeImage}`}
                            alt="Large QR Code"
                            sx={{
                              width: 200,
                              height: 200,
                              borderRadius: 2,
                              mx: "auto",
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </AppointmentCard>
                </Grid>
              );
            })}
          </Grid>
          <Pagination
            count={Math.ceil(sortedAppointments.length / itemsPerPage)}
            page={page}
            onChange={onPageChange}
            color="primary"
            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </Box>
  );
};

export default BookedAppointments;
