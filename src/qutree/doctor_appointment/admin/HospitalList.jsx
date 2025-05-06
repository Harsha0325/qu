import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";
import HospitalCardItem from "./HospitalCardItem";
import HospitalDetailModal from "./HospitalDetailModal";

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressCache, setAddressCache] = useState({});
  const [selectedHospital, setSelectedHospital] = useState(null);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!userId) {
        toast.error("User ID is missing from local storage");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const endpoint = `/hospitals/all`;
        const res = await axios.get(endpoint);
        setHospitals(res.data || []);
      } catch (err) {
        toast.error("Error fetching hospitals");
        console.error(err);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [userId]);

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
          Loading hospitals...
        </Typography>
      </Box>
    );
  }

  if (hospitals.length === 0) {
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
          No hospitals found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {hospitals.map((hospital) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hospital.id}>
            <HospitalCardItem
              hospital={hospital}
              onCardClick={() => setSelectedHospital(hospital)}
            />
          </Grid>
        ))}
      </Grid>
      <HospitalDetailModal
        hospital={selectedHospital}
        open={!!selectedHospital}
        onClose={() => setSelectedHospital(null)}
        addressCache={addressCache}
        updateAddressCache={updateAddressCache}
      />
    </>
  );
};

export default HospitalList;
