import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const textFieldSx = {
  bgcolor: "grey.50",
  "&:hover": { bgcolor: "grey.100" },
};

const CreateHospital = ({ onClose }) => {
  const initialFormData = {
    name: "",
    location: "",
    pincode: "",
    latitude: 12.97701298892783,
    longitude: 77.57737308740617,
    adminId: "",
    profilePicture: null,
    referenceImages: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  const profileInputRef = useRef(null);
  const referenceInputRef = useRef(null);
  const navigate = useNavigate();

  const [adminIds, setAdminIds] = useState([]);
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("/hospitals/admin/allid");
        setAdminIds(res.data || []);
      } catch (err) {
        toast.error("Error fetching admin IDs");
      }
    };
    fetchAdmins();

    getAddressFromCoords(
      initialFormData.latitude,
      initialFormData.longitude
    ).then((address) => setSelectedAddress(address));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if ((name === "latitude" || name === "longitude") && leafletMap.current) {
        const lat = parseFloat(newData.latitude);
        const lng = parseFloat(newData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          leafletMap.current.setView([lat, lng], 13);
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }
          getAddressFromCoords(lat, lng).then((address) =>
            setSelectedAddress(address)
          );
        }
      }
      return newData;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePicture") {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] || null }));
      setErrors((prev) => ({ ...prev, profilePicture: "" }));
    } else if (name === "referenceImages") {
      setFormData((prev) => ({ ...prev, referenceImages: Array.from(files) }));
      setErrors((prev) => ({ ...prev, referenceImages: "" }));
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "YourAppName/1.0 (your.email@example.com)",
          "Accept-Language": "en",
        },
      });
      const data = await response.json();
      if (data && data.address) {
        const { address } = data;
        const parts = [
          address.road || "",
          address.city || address.town || address.village || "",
          address.state || "",
          address.postcode || "",
          address.country || "India",
        ].filter(Boolean);
        return parts.join(", ") || "Address not found";
      }
      return "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Hospital name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.latitude || isNaN(formData.latitude))
      newErrors.latitude = "Valid latitude is required";
    if (!formData.longitude || isNaN(formData.longitude))
      newErrors.longitude = "Valid longitude is required";
    if (!formData.adminId) newErrors.adminId = "Admin ID is required";
    if (!formData.profilePicture)
      newErrors.profilePicture = "Profile picture is mandatory";
    if (formData.referenceImages.length < 2)
      newErrors.referenceImages = "At least two reference images are required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields correctly");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("pincode", formData.pincode);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("adminId", formData.adminId);
    data.append("profilePicture", formData.profilePicture);

    if (Array.isArray(formData.referenceImages)) {
      formData.referenceImages.forEach((image) =>
        data.append("referenceImages", image)
      );
    } else {
      console.error(
        "referenceImages is not an array:",
        formData.referenceImages
      );
    }

    try {
      await axios.post("/hospitals/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Hospital created successfully!");
      resetForm();
      onClose();
      navigate(0);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Error creating hospital");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedAddress("");
    setErrors({});
    if (profileInputRef.current) profileInputRef.current.value = "";
    if (referenceInputRef.current) referenceInputRef.current.value = "";
  };

  useEffect(() => {
    if (
      !mapRef.current ||
      isNaN(formData.latitude) ||
      isNaN(formData.longitude)
    )
      return;

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (leafletMap.current) {
      leafletMap.current.setView([lat, lng], 13);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    } else {
      leafletMap.current = L.map(mapRef.current).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap.current);
      markerRef.current = L.marker([lat, lng]).addTo(leafletMap.current);

      leafletMap.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        markerRef.current.setLatLng([lat, lng]);
        getAddressFromCoords(lat, lng).then((address) =>
          setSelectedAddress(address)
        );
        toast.info(`Location selected: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      });
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.off("click");
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [formData.latitude, formData.longitude]);

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 800,
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        "&:hover": {
          transform: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Typography variant="h5" color="primary" align="center" gutterBottom>
        Create New Hospital
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Hospital Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              error={!!errors.name}
              helperText={errors.name}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              error={!!errors.location}
              helperText={errors.location}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              error={!!errors.pincode}
              helperText={errors.pincode}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              fullWidth
              type="number"
              variant="outlined"
              inputProps={{ step: "any" }}
              required
              error={!!errors.latitude}
              helperText={errors.latitude}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              fullWidth
              type="number"
              variant="outlined"
              inputProps={{ step: "any" }}
              required
              error={!!errors.longitude}
              helperText={errors.longitude}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                height: { xs: 200, sm: 300 },
                mt: 2,
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "grey.100",
              }}
            >
              <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
            </Box>
            <Typography
              variant="caption"
              align="center"
              sx={{ mt: 1, display: "block" }}
            >
              Click on the map to select a location
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              <strong>Selected Address:</strong>{" "}
              {selectedAddress || "No location selected yet"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Admin ID"
              name="adminId"
              value={formData.adminId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              error={!!errors.adminId}
              helperText={errors.adminId || "Select an admin"}
              sx={textFieldSx}
            >
              <MenuItem value="" disabled>
                Select an Admin
              </MenuItem>
              {adminIds.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.profilePicture}>
              <InputLabel shrink>Profile Picture *</InputLabel>
              <TextField
                name="profilePicture"
                type="file"
                inputRef={profileInputRef}
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                inputProps={{ accept: "image/*" }}
                required
                sx={textFieldSx}
              />
              <FormHelperText>
                {errors.profilePicture || "Upload one profile image"}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.referenceImages}>
              <InputLabel shrink>Reference Images (Min 2) *</InputLabel>
              <TextField
                name="referenceImages"
                type="file"
                inputRef={referenceInputRef}
                onChange={handleFileChange} // Fixed!
                fullWidth
                variant="outlined"
                inputProps={{ multiple: true, accept: "image/*" }}
                required
                sx={textFieldSx}
              />
              <FormHelperText>
                {errors.referenceImages ||
                  `Selected: ${formData.referenceImages.length} images (min 2)`}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2, mx: 1, px: 4, py: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : "Create Hospital"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
              sx={{ mt: 2, mx: 1, px: 4, py: 1 }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default CreateHospital;
