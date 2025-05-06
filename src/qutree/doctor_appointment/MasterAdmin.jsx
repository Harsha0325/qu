import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Container,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CreateHospital from "./admin/CreateHospital";
import HospitalList from "./admin/HospitalList";

const theme = createTheme({
  palette: {
    primary: { main: "#00C7FA" }, // Cyan-blue for accents
    secondary: { main: "#ff9800" }, // Orange for secondary accents
    background: {
      default: "#E8ECEF", // Soft gray background
      paper: "#FFFFFF", // Solid white for standard backgrounds
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

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default", // #E8ECEF
          ml: { xs: 0, md: "250px" },
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}
        >
          <Card
            sx={{
              mb: 4,
              borderRadius: 6,
              height: { xs: 150, md: 200 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main", // #00C7FA for banner
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
              Master Admin Management - Doctor Appointment
            </Typography>
          </Card>

          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                mb={3}
              >
                <Typography variant="h5">Hospital List</Typography>
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  color="primary" // #00C7FA
                  size="medium"
                  sx={{ minWidth: 140, px: 3, py: 1 }}
                >
                  Create Hospital
                </Button>
              </Stack>
              <HospitalListWrapped />
            </CardContent>
          </Card>
        </Container>

        <CreateHospitalModal open={showModal} onClose={handleCloseModal} />
      </Box>
    </ThemeProvider>
  );
};

const HospitalListWrapped = React.memo(() => <HospitalList />);

const CreateHospitalModal = React.memo(({ open, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { p: { xs: 2, sm: 3 }, m: { xs: 1, md: 2 } }, // Solid background via theme
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <CreateHospital onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
});

export default AdminDashboard;
