import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Container,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CreateDoctor from "./admin/CreateDoctor";
import DoctorList from "./admin/DoctorList";
import axios from "@axios";
import { useAuth } from "../../context/AuthContext";

const theme = createTheme({
  palette: {
    primary: { main: "#00C7FA" }, // Cyan-blue for accents
    secondary: { main: "#ff9800" }, // Orange for secondary accents
    background: {
      default: "#E8ECEF", // Soft gray background
      paper: "#FFFFFF", // Solid white for non-glass elements
    },
    text: {
      primary: "#2D3748", // Dark gray for main text
      secondary: "#718096", // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h4: { fontWeight: 700, color: "#2D3748" },
    h5: { fontWeight: 600, color: "#2D3748" },
    body2: { color: "#718096" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.8)", // Glass effect for cards
          backdropFilter: "blur(10px)", // Blur for glass finish
          border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          transition: "box-shadow 0.3s, transform 0.2s",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)", // Subtle lift
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#00A8D6", // Darker cyan for hover
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "#FFFFFF", // Solid white for modal, no glass
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(0, 199, 250, 0.1)", // Light cyan hover for unselected chips
          },
        },
        filled: {
          "&:hover": {
            backgroundColor: "#00A8D6", // Darker cyan for selected chip hover
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32, // Fixed width
          height: 32, // Fixed height
          fontSize: "1rem", // Adjust text size if no image
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  // const [hospitalId, setHospitalId] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/hospitals/admin/${userId}`);
        setHospitals(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [userId]);

  // const handleHospitalSelect = (id) => {
  //   setHospitalId(id === hospitalId ? null : id); // Toggle selection
  // };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default", // #E8ECEF
          minHeight: "100vh",
          ml: { xs: 0, md: "250px" },
          transition: "margin-left 0.3s ease-in-out",
          width: { xs: "100%", md: "calc(100% - 250px)" },
          overflowX: "hidden",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}
        >
          {/* Banner */}
          <Card
            sx={{
              mb: 4,
              p: 2,
              borderRadius: 6,
              height: { xs: 150, md: 200 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main", // #00C7FA
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                fontSize: { xs: "1.5rem", md: "2.125rem" },
              }}
            >
              Admin Management - Doctor Appointment
            </Typography>
          </Card>

          {/* Doctor Management Card */}
          <Card sx={{ p: { xs: 2, sm: 3 }, overflow: "visible" }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h5">Doctors by Hospital</Typography>
                <Button
                  onClick={() => setShowModal(true)}
                  variant="contained"
                  color="primary" // #00C7FA
                  size="medium"
                  sx={{
                    mt: { xs: 2, sm: 0 },
                    minWidth: 120,
                    px: 3,
                    py: 1,
                  }}
                >
                  Add New Doctor
                </Button>
              </Stack>

              {/* Hospital Selection */}
              {/* <Box
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  borderRadius: 12,
                  border: "1px solid",
                  borderColor: "grey.200",
                  p: 2,
                }}
              >
                {loading ? (
                  <Typography>Loading hospitals...</Typography>
                ) : hospitals.length > 0 ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {hospitals.map((hospital) => (
                      <Chip
                        key={hospital.id}
                        avatar={
                          <Avatar
                            alt={hospital.name}
                            src={
                              hospital.profilePictureUrl
                                ? `data:image/jpeg;base64,${hospital.profilePictureUrl}`
                                : undefined
                            }
                            sx={{
                              width: 32, // Fixed width
                              height: 32, // Fixed height
                              objectFit: "cover", // Ensure image fits
                            }}
                          >
                            {hospital.name[0]}
                          </Avatar>
                        }
                        label={hospital.name}
                        variant={
                          hospitalId === hospital.id ? "filled" : "outlined"
                        }
                        color={
                          hospitalId === hospital.id ? "primary" : "default"
                        }
                        onClick={() => handleHospitalSelect(hospital.id)}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary" align="center">
                    No hospitals found
                  </Typography>
                )}
              </Box> */}

              {/* Doctor List */}
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <DoctorList />
              </Box>
            </CardContent>
          </Card>

          {/* Doctor Creation Dialog */}
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                p: 2,
              },
            }}
          >
            <DialogContent sx={{ p: 0 }}>
              <CreateDoctor onClose={() => setShowModal(false)} />
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;
