import React, { useState, useEffect } from "react";
import { Box, Modal } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "@axios";
import { toast } from "react-toastify";
import Banner from "./user/Banner";
import HomeContent from "./user/HomeContent";
import BookingModal from "./user/BookingModal";
import BookedAppointments from "./user/BookedAppointments";
// import AvailableAppointments from "./user/AvailableAppointments";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h2: { fontWeight: 700, letterSpacing: "-0.5px" },
    h5: { fontWeight: 600 },
    body1: { fontSize: "1.2rem", lineHeight: 1.6 },
    subtitle1: { fontSize: "1rem", color: "text.secondary" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        },
      },
    },
  },
});

function AppointmentUser() {
  const [modalType, setModalType] = useState(null);
  const [modalStep, setModalStep] = useState("hospital");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const itemsPerPage = 5;
  const userId = localStorage.getItem("userId");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/appointments/user/${userId}`);
      setAppointments(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const handleViewChange = (newModalType) => {
    setModalType(newModalType);
    setPage(1);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setModalStep("hospital");
  };

  const handleCloseModal = () => {
    setModalType(null);
    fetchAppointments();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          pt: "64px", // Navbar height
          ml: { xs: 0, md: "230px" }, // Sidebar width
          width: { xs: "100%", md: "calc(100% - 230px)" },
          overflowX: "hidden",
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* Content Area */}
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: { xs: 2, md: 3 },
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            flexDirection: "column",
            gap: 4, // Increased gap for better separation
            zIndex: 5,
          }}
        >
          <Banner onBookClick={() => handleViewChange("book")} />
          <HomeContent onViewChange={handleViewChange} />
        </Box>
        {/* Modals */}
        {modalType === "book" && (
          <BookingModal
            open={!!modalType}
            onClose={handleCloseModal}
            step={modalStep}
            selectedHospital={selectedHospital}
            selectedDoctor={selectedDoctor}
            onHospitalSelect={(hospital) => {
              setSelectedHospital(hospital);
              setModalStep("doctor");
            }}
            onDoctorSelect={(doctor) => {
              setSelectedDoctor(doctor);
              setModalStep("form");
            }}
            refreshAppointments={fetchAppointments}
            userId={userId}
          />
        )}
        {modalType === "myAppointments" && (
          <Modal open={!!modalType} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: { xs: "50%", md: "calc(50% + 125px)" },
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: "80%", md: "calc(100% - 300px)" },
                maxWidth: 900,
                maxHeight: "80vh",
                overflowY: "auto",
                bgcolor: "white",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                boxShadow: 24,
                zIndex: 1000,
              }}
            >
              <BookedAppointments
                appointments={appointments}
                loading={loading}
                page={page}
                itemsPerPage={itemsPerPage}
                onPageChange={(_, value) => setPage(value)}
              />
            </Box>
          </Modal>
        )}
        {/* {modalType === "available" && (
          <Modal open={!!modalType} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: { xs: "50%", md: "calc(50% + 125px)" },
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: "80%", md: "calc(100% - 300px)" },
                maxWidth: 900,
                maxHeight: "80vh",
                overflowY: "auto",
                bgcolor: "white",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                boxShadow: 24,
                zIndex: 1000,
              }}
            >
              <AvailableAppointments />
            </Box>
          </Modal> 
         )} */}
      </Box>
    </ThemeProvider>
  );
}

export default AppointmentUser;
