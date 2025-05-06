import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios"; // Assuming you're using axios for API calls
import { toast } from "react-toastify"; // For notifications

const UpdateDoctorTokenLimit = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [tokenLimit, setTokenLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://192.168.30.81:9093/api/quicky_net/doctors"
        );
        setDoctors(response.data);
      } catch (err) {
        setError("Failed to fetch doctors");
        toast.error("Error loading doctors");
      }
    };
    fetchDoctors();
  }, []);

  // Fetch current token limit when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      const fetchTokenLimit = async () => {
        try {
          const response = await axios.get(
            `http://192.168.30.81:9093/api/quicky_net/doctors/${selectedDoctor}/token-config`
          );
          setTokenLimit(response.data.tokenLimit || "");
        } catch (err) {
          setTokenLimit(""); // Reset if no config exists
        }
      };
      fetchTokenLimit();
    }
  }, [selectedDoctor]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://192.168.30.81:9093/api/quicky_net/doctors/${selectedDoctor}/token-config`,
        { tokenLimit: parseInt(tokenLimit, 10) }
      );
      toast.success(
        `Token limit updated to ${tokenLimit} for Doctor ID ${selectedDoctor}`
      );
      setTokenLimit(""); // Optionally keep the value for further edits
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update token limit";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-lg mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg">
      <Typography
        variant="h5"
        className="text-center text-gray-800 mb-6 font-bold"
      >
        Update Doctor Token Limit
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth className="mb-4">
          <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
          <Select
            labelId="doctor-select-label"
            value={selectedDoctor}
            label="Select Doctor"
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-gray-50"
            disabled={loading}
          >
            <MenuItem value="">
              <em>Select a doctor</em>
            </MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name} (ID: {doctor.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Token Limit Per Day"
          type="number"
          value={tokenLimit}
          onChange={(e) => setTokenLimit(e.target.value)}
          className="mb-6 bg-gray-50"
          inputProps={{ min: 1 }}
          disabled={loading || !selectedDoctor}
          placeholder="Enter number of tokens"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={
            loading || !selectedDoctor || !tokenLimit || tokenLimit <= 0
          }
          className="py-3 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Token Limit"
          )}
        </Button>
      </form>
    </Box>
  );
};

export default UpdateDoctorTokenLimit;
