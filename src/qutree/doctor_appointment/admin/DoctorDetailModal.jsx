import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  IconButton,
  Modal,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { toast } from "react-toastify";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "80vh",
  overflowY: "auto",
};

const DoctorDetailModal = React.memo(
  ({ doctor, open, onClose, addressCache, updateAddressCache }) => {
    const [address, setAddress] = useState("Loading...");
    const [tokenLimit, setTokenLimit] = useState("");
    const [isEditingToken, setIsEditingToken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch address when modal opens
    useEffect(() => {
      const fetchAddress = async () => {
        if (!doctor || !doctor.latitude || !doctor.longitude) {
          setAddress("N/A");
          return;
        }

        const coordsKey = `${doctor.latitude},${doctor.longitude}`;
        if (addressCache[coordsKey]) {
          setAddress(addressCache[coordsKey]);
        } else {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${doctor.latitude}&lon=${doctor.longitude}&zoom=18&addressdetails=1`;
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Throttle for Nominatim rate limit
            const response = await fetch(url, {
              headers: {
                "User-Agent": "YourAppName/1.0 (your.email@example.com)", // Replace with your details
                "Accept-Language": "en",
              },
            });
            const data = await response.json();
            if (data && data.address) {
              const fullAddress =
                [
                  data.address.road,
                  data.address.city ||
                    data.address.town ||
                    data.address.village,
                  data.address.state,
                  data.address.postcode,
                  data.address.country || "India",
                ]
                  .filter(Boolean)
                  .join(", ") || "Address not found";
              updateAddressCache(coordsKey, fullAddress);
              setAddress(fullAddress);
            } else {
              setAddress("Address not found");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Error fetching address");
          }
        }
      };

      if (open && doctor) {
        setAddress("Loading...");
        fetchAddress();
      }
    }, [open, doctor, addressCache, updateAddressCache]);

    // Fetch current token limit when modal opens
    useEffect(() => {
      if (open && doctor) {
        const fetchTokenLimit = async () => {
          try {
            const response = await axios.get(
              `http://192.168.30.81:9093/api/quicky_net/doctors/${doctor.id}/token-config`
            );
            setTokenLimit(response.data.tokenLimit || "");
          } catch (err) {
            setTokenLimit(""); // Reset if no config exists
          }
        };
        fetchTokenLimit();
      }
    }, [open, doctor]);

    // Reset states when modal closes
    useEffect(() => {
      if (!open) {
        setAddress("Loading...");
        setTokenLimit("");
        setIsEditingToken(false);
        setError(null);
      }
    }, [open]);

    // Handle token limit update
    const handleTokenUpdate = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        await axios.put(
          `http://192.168.30.81:9093/api/quicky_net/doctors/${doctor.id}/token-config`,
          { tokenLimit: parseInt(tokenLimit, 10) }
        );
        toast.success(
          `Token limit updated to ${tokenLimit} for Dr. ${doctor.name}`
        );
        setIsEditingToken(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update token limit";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const navigateToGoogleMaps = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: userLat, longitude: userLng } = position.coords;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${doctor.latitude},${doctor.longitude}&travelmode=driving`;
            window.open(url, "_blank");
          },
          (error) => {
            toast.warn(
              "Unable to get your location. Showing doctor location instead."
            );
            const url = `https://www.google.com/maps/search/?api=1&query=${doctor.latitude},${doctor.longitude}`;
            window.open(url, "_blank");
          }
        );
      } else {
        toast.warn(
          "Geolocation not supported. Showing doctor location instead."
        );
        const url = `https://www.google.com/maps/search/?api=1&query=${doctor.latitude},${doctor.longitude}`;
        window.open(url, "_blank");
      }
    };

    if (!doctor) return null;

    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" color="primary" gutterBottom>
            Dr. {doctor.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ID: {doctor.id}
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Hospital:</strong> {doctor.hospitalName} (ID:{" "}
            {doctor.hospitalId})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Location:</strong> {doctor.location || "N/A"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Pincode:</strong> {doctor.pincode || "N/A"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Address:</strong> {address}
            </Typography>
            {doctor.latitude && doctor.longitude && (
              <IconButton
                color="primary"
                onClick={navigateToGoogleMaps}
                sx={{ p: 0.5, "&:hover": { color: "primary.dark" } }}
                title="Get Directions"
              >
                <DirectionsIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Phone:</strong> {doctor.phoneNumber || "N/A"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Specialization:</strong>
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
            {doctor.specialization?.length > 0 ? (
              doctor.specialization.map((spec, index) => (
                <Chip
                  key={index}
                  label={spec}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{ fontSize: "0.8125rem", borderRadius: "12px" }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Admin ID:</strong> {doctor.adminId || "N/A"}
          </Typography>

          {/* Token Limit Section */}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Token Limit Per Day:</strong>{" "}
              {isEditingToken ? "" : tokenLimit || "Not Set"}
            </Typography>
            {!isEditingToken && (
              <IconButton
                color="primary"
                onClick={() => setIsEditingToken(true)}
                sx={{ p: 0.5, "&:hover": { color: "primary.dark" } }}
                title="Update Token Limit"
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          {isEditingToken && (
            <form onSubmit={handleTokenUpdate}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Token Limit Per Day"
                type="number"
                value={tokenLimit}
                onChange={(e) => setTokenLimit(e.target.value)}
                sx={{ mb: 2, bgcolor: "grey.50" }}
                inputProps={{ min: 1 }}
                disabled={loading}
                placeholder="Enter number of tokens"
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !tokenLimit || tokenLimit <= 0}
                  sx={{ flex: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEditingToken(false)}
                  sx={{ flex: 1 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
    );
  }
);

export default DoctorDetailModal;
