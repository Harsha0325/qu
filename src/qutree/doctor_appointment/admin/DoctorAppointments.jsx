import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@axios";
import { toast } from "react-toastify";
import { BrowserQRCodeReader } from "@zxing/library";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  PersonPinCircle as PersonPinCircleIcon,
  DoneAll as DoneAllIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const DoctorAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDateIndex, setCurrentDateIndex] = useState(-1);
  const [openScanner, setOpenScanner] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [manualQrInput, setManualQrInput] = useState("");
  const videoRef = useRef(null);
  const qrReader = useRef(null);

  // Fetch appointments
  useEffect(() => {
    let mounted = true;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/appointments/doctor/${doctorId}/all-booked`
        );
        if (mounted) {
          // Sort by date and then token number
          const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) return dateA - dateB; // Sort by date first
            return (a.tokenNumber || 0) - (b.tokenNumber || 0); // Then by token number
          });
          setAppointmentData(sortedData);

          const today = new Date().toISOString().split("T")[0];
          const uniqueDates = [...new Set(sortedData.map((appt) => appt.date))];
          const todayIndex = uniqueDates.indexOf(today);
          setCurrentDateIndex(todayIndex !== -1 ? todayIndex : 0);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(
          error.response?.data?.message || "Failed to load appointments"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAppointments();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [doctorId]);

  // Fetch camera devices
  useEffect(() => {
    let mounted = true;

    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        if (mounted) {
          setDevices(videoDevices);
          const backCamera = videoDevices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("rear")
          );
          setCameraId(
            backCamera ? backCamera.deviceId : videoDevices[0]?.deviceId
          );
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
        toast.error("Unable to access cameras");
      }
    };
    if (navigator.mediaDevices) getCameras();

    return () => {
      mounted = false;
    };
  }, []);

  // Navigation and date handling
  const handleBack = () => navigate(-1);
  const handlePreviousDate = () =>
    currentDateIndex > 0 && setCurrentDateIndex(currentDateIndex - 1);
  const handleNextDate = () =>
    currentDateIndex < uniqueDates.length - 1 &&
    setCurrentDateIndex(currentDateIndex + 1);
  const getDayName = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });

  // Status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const { data } = await axios.put(
        `/appointments/${appointmentId}/status`,
        { status: newStatus }
      );
      const friendlyStatus = getFriendlyStatus(newStatus);
      toast.success(
        `Appointment ${appointmentId} updated to "${friendlyStatus}"`
      );
      setAppointmentData((prev) =>
        prev.map((appt) => (appt.id === appointmentId ? data : appt))
      );
    } catch (error) {
      console.error(`Error updating to ${newStatus}:`, error);
      toast.error(error.response?.data?.message || `Failed to update status`);
    }
  };

  const isPastAppointment = (date) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    return now > new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000);
  };

  // QR Scanner
  const startCamera = async () => {
    if (!videoRef.current || !cameraId) {
      toast.error("No camera available");
      return;
    }
    try {
      const qrCodeReader = new BrowserQRCodeReader();
      qrReader.current = qrCodeReader;
      setScanning(true);
      await qrCodeReader.decodeFromVideoDevice(
        cameraId,
        videoRef.current,
        (result, error) => {
          if (result) handleQrScan(result.getText());
          if (error && error.name !== "NotFoundException")
            console.error("Scanning error:", error);
        }
      );
    } catch (err) {
      console.error("Error starting QR scanner:", err);
      toast.error("Error starting scanner");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (qrReader.current) {
      qrReader.current.stopContinuousDecode();
      qrReader.current.reset();
      qrReader.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleQrScan = async (data) => {
    if (!data) return;
    try {
      const response = await axios.post("/appointments/verify", {
        qrCodeData: data,
      });
      toast.success(
        `Appointment ${response.data.id} marked as "Patient Arrived"`
      );
      setAppointmentData((prev) =>
        prev.map((appt) =>
          appt.id === response.data.id ? response.data : appt
        )
      );
      stopCamera();
      setOpenScanner(false);
    } catch (error) {
      console.error("Error verifying QR code:", error);
      toast.error(error.response?.data?.message || "Error verifying QR code");
    }
  };

  const handleManualQrSubmit = () => {
    if (manualQrInput.trim()) {
      handleQrScan(manualQrInput.trim());
      setManualQrInput("");
    } else {
      toast.warn("Please enter a valid QR code");
    }
  };

  const openQrScanner = () => {
    setOpenScanner(true);
    setTimeout(startCamera, 100);
  };

  const closeQrScanner = () => {
    stopCamera();
    setOpenScanner(false);
  };

  const switchCamera = () => {
    if (devices.length <= 1) return;
    const currentIndex = devices.findIndex(
      (device) => device.deviceId === cameraId
    );
    const nextIndex = (currentIndex + 1) % devices.length;
    setCameraId(devices[nextIndex].deviceId);
    stopCamera();
    setTimeout(startCamera, 100);
    toast.info(`Switched to ${devices[nextIndex].label || "other"} camera`);
  };

  // Status helpers
  const getStatusIcon = (status, isPast) => {
    if (isPast) return <HourglassEmptyIcon />;
    switch (status.toLowerCase()) {
      case "requested":
        return <ScheduleIcon />;
      case "accepted":
        return <CheckCircleIcon />;
      case "arrived":
        return <PersonPinCircleIcon />;
      case "completed":
        return <DoneAllIcon />;
      case "cancelled":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const getFriendlyStatus = (status) => {
    switch (status.toLowerCase()) {
      case "requested":
        return "Waiting for Approval";
      case "accepted":
        return "Approved";
      case "arrived":
        return "Patient Arrived";
      case "completed":
        return "Treatment Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const uniqueDates = [...new Set(appointmentData.map((appt) => appt.date))];
  const currentDate =
    uniqueDates[currentDateIndex] || new Date().toISOString().split("T")[0];
  const appointmentsForCurrentDate = appointmentData
    .filter((appt) => appt.date === currentDate)
    .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0)); // Ensure token sorting for current date

  return (
    <Box className="min-h-screen bg-gray-50 p-4 sm:p-6 sm:ml-60">
      {/* Header with Breadcrumbs */}
      <Box className="mb-6">
        <Breadcrumbs aria-label="breadcrumb" className="text-gray-600">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/dashboard")}
          >
            <HomeIcon className="mr-1" /> Dashboard
          </Link>
          <Typography color="text.primary">
            Doctor Appointments (ID: {doctorId})
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" className="mt-2 text-gray-800 font-bold">
          Doctor's Appointments
        </Typography>
      </Box>

      {/* Date Navigation */}
      <Box className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <IconButton
          onClick={handlePreviousDate}
          disabled={currentDateIndex === 0}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h6" className="text-gray-700 font-semibold">
          {currentDate} ({getDayName(currentDate)})
        </Typography>
        <IconButton
          onClick={handleNextDate}
          disabled={currentDateIndex === uniqueDates.length - 1}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Box className="flex flex-col items-center justify-center py-10">
          <CircularProgress />
          <Typography className="mt-2 text-gray-600">
            Loading appointments...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {appointmentsForCurrentDate.length > 0 ? (
            appointmentsForCurrentDate.map((appointment) => {
              const isPast = isPastAppointment(appointment.date);
              return (
                <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                  <Card
                    sx={{
                      width: "100%",
                      maxWidth: 340,
                      height: 260,
                      borderRadius: "12px",
                      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      transition: "box-shadow 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      <Box className="flex justify-between items-center mb-3">
                        <Typography
                          variant="h6"
                          className="text-gray-800 font-semibold text-lg"
                        >
                          Token #{appointment.tokenNumber || "N/A"}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(appointment.status, isPast)}
                          label={
                            isPast
                              ? "Expired"
                              : getFriendlyStatus(appointment.status)
                          }
                          size="small"
                          sx={{
                            borderRadius: "16px",
                            fontWeight: "medium",
                            ...(isPast
                              ? { color: "#6b7280", borderColor: "#d1d5db" }
                              : appointment.status === "cancelled"
                              ? { color: "#ef4444", borderColor: "#ef4444" }
                              : { color: "#3b82f6", borderColor: "#3b82f6" }),
                          }}
                          variant="outlined"
                        />
                      </Box>
                      <Divider sx={{ my: 2, borderColor: "#e5e7eb" }} />
                      <Box className="flex-1">
                        <Typography className="text-gray-700 text-sm mb-2">
                          <strong className="text-gray-900">Patient:</strong>{" "}
                          {appointment.user?.fullName || "Unknown"}{" "}
                          <span className="text-gray-500">
                            ({appointment.user?.id || "N/A"})
                          </span>
                        </Typography>
                        <Typography className="text-gray-700 text-sm">
                          <strong className="text-gray-900">Hospital:</strong>{" "}
                          {appointment.hospitalName || "N/A"}
                        </Typography>
                      </Box>
                      <Box className="mt-4 flex flex-wrap gap-2">
                        {appointment.status === "requested" && !isPast && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleStatusUpdate(appointment.id, "accepted")
                            }
                            sx={{
                              backgroundColor: "#3b82f6",
                              "&:hover": { backgroundColor: "#2563eb" },
                              borderRadius: "6px",
                              textTransform: "none",
                              fontWeight: "medium",
                              px: 2,
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        {appointment.status === "accepted" && !isPast && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleStatusUpdate(appointment.id, "arrived")
                            }
                            sx={{
                              backgroundColor: "#3b82f6",
                              "&:hover": { backgroundColor: "#2563eb" },
                              borderRadius: "6px",
                              textTransform: "none",
                              fontWeight: "medium",
                              px: 2,
                            }}
                          >
                            Arrived
                          </Button>
                        )}
                        {appointment.status === "arrived" && !isPast && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleStatusUpdate(appointment.id, "completed")
                            }
                            sx={{
                              backgroundColor: "#3b82f6",
                              "&:hover": { backgroundColor: "#2563eb" },
                              borderRadius: "6px",
                              textTransform: "none",
                              fontWeight: "medium",
                              px: 2,
                            }}
                          >
                            Done
                          </Button>
                        )}
                        {appointment.status !== "completed" &&
                          appointment.status !== "cancelled" &&
                          !isPast && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "cancelled")
                              }
                              sx={{
                                borderColor: "#ef4444",
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "#fef2f2",
                                  borderColor: "#dc2626",
                                },
                                borderRadius: "6px",
                                textTransform: "none",
                                fontWeight: "medium",
                                px: 2,
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box className="w-full text-center py-10">
              <Typography className="text-gray-600">
                No appointments scheduled for this date
              </Typography>
            </Box>
          )}
        </Grid>
      )}

      {/* Footer */}
      <Box className="mt-8 flex justify-center gap-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<QrCodeScannerIcon />}
          onClick={openQrScanner}
          sx={{
            backgroundColor: "#3b82f6",
            "&:hover": { backgroundColor: "#2563eb" },
            borderRadius: "9999px",
            px: 4,
            py: 1.5,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          Scan QR
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBack}
          sx={{
            backgroundColor: "#6b7280",
            "&:hover": { backgroundColor: "#4b5563" },
            borderRadius: "9999px",
            px: 4,
            py: 1.5,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          Back
        </Button>
      </Box>

      {/* QR Scanner Dialog */}
      <Dialog
        open={openScanner}
        onClose={closeQrScanner}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-center text-gray-800 font-semibold">
          Scan QR Code to Mark Arrival
        </DialogTitle>
        <DialogContent>
          <Box className="relative w-full" style={{ paddingTop: "75%" }}>
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg border border-gray-300"
            />
          </Box>
          {scanning && (
            <Box className="flex justify-center items-center mt-2">
              <CircularProgress size={24} />
              <Typography className="ml-2 text-gray-600">
                Scanning...
              </Typography>
            </Box>
          )}
          <TextField
            label="Enter QR Code Manually"
            value={manualQrInput}
            onChange={(e) => setManualQrInput(e.target.value)}
            fullWidth
            className="mt-4"
            disabled={scanning}
            variant="outlined"
          />
          <Box className="mt-4 flex justify-between gap-2">
            <Button
              variant="outlined"
              color="primary"
              onClick={switchCamera}
              disabled={devices.length <= 1 || !scanning}
              sx={{
                borderColor: "#3b82f6",
                color: "#3b82f6",
                "&:hover": {
                  borderColor: "#2563eb",
                  backgroundColor: "#eff6ff",
                },
                flex: 1,
              }}
            >
              Switch Camera
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleManualQrSubmit}
              disabled={scanning}
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
                flex: 1,
              }}
            >
              Submit Manual
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={closeQrScanner}
              sx={{
                borderColor: "#ef4444",
                color: "#ef4444",
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "#fef2f2",
                },
                flex: 1,
              }}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorAppointments;
