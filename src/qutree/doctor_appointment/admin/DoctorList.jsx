import React, { useState, useEffect } from "react";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";
import DoctorCardItem from "./DoctorCardItem"; // New component
import DoctorDetailModal from "./DoctorDetailModal"; // New component

const DoctorList = ({ hospitalId }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressCache, setAddressCache] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!userId) {
        toast.error("User ID is missing from local storage");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const endpoint = hospitalId
          ? `/doctors/all/by-hospital-id/${hospitalId}`
          : `/doctors/all/by-admin/${userId}`;
        const res = await axios.get(endpoint);
        setDoctors(
          (res.data || []).map((doctor) => ({
            ...doctor,
            address:
              addressCache[`${doctor.latitude},${doctor.longitude}`] || null,
          }))
        );
      } catch (err) {
        toast.error("Error fetching doctors");
        console.error(err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [hospitalId, userId]);

  const updateAddressCache = (coordsKey, address) => {
    setAddressCache((prev) => ({ ...prev, [coordsKey]: address }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading doctors...
        </Typography>
      </Box>
    );
  }

  if (doctors.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No doctors found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Grid
          container
          spacing={{ xs: 2.5, sm: 3.5, md: 4 }}
          justifyContent="flex-start"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            mx: "auto",
            // border: "1px solid green",
            px: { xs: 0, sm: 1 },
          }}
        >
          {doctors.map((doctor) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={doctor.id}
              sx={{
                // border: "1px solid red",
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
                alignItems: "stretch",
                minWidth: { xs: "100%", sm: "auto" },
                maxWidth: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
              }}
            >
              <DoctorCardItem
                doctor={doctor}
                onCardClick={() => setSelectedDoctor(doctor)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <DoctorDetailModal
        doctor={selectedDoctor}
        open={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        addressCache={addressCache}
        updateAddressCache={updateAddressCache}
      />
    </>
  );
};

export default DoctorList;
