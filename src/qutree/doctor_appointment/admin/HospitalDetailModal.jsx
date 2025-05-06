import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, IconButton, Modal } from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "80vh",
  overflowY: "auto",
};

const imageAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

const HospitalDetailModal = React.memo(
  ({ hospital, open, onClose, addressCache, updateAddressCache }) => {
    const [address, setAddress] = useState("Loading...");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
      const fetchAddress = async () => {
        if (!hospital || !hospital.latitude || !hospital.longitude) {
          setAddress("N/A");
          return;
        }

        const coordsKey = `${hospital.latitude},${hospital.longitude}`;
        if (addressCache[coordsKey]) {
          setAddress(addressCache[coordsKey]);
        } else {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${hospital.latitude}&lon=${hospital.longitude}&zoom=18&addressdetails=1`;
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
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
              const fullAddress = parts.join(", ") || "Address not found";
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

      if (open && hospital) {
        setAddress("Loading...");
        setImagesLoaded(true);
        fetchAddress();
      }
    }, [open, hospital, addressCache, updateAddressCache]);

    useEffect(() => {
      if (!open) {
        setAddress("Loading...");
        setCurrentImageIndex(0);
        setImagesLoaded(false);
        setAutoPlay(true);
      }
    }, [open]);

    useEffect(() => {
      if (
        open &&
        hospital &&
        hospital.referenceImagesUrls &&
        hospital.referenceImagesUrls.length > 1 &&
        imagesLoaded &&
        autoPlay
      ) {
        const interval = setInterval(() => {
          setCurrentImageIndex(
            (prev) => (prev + 1) % hospital.referenceImagesUrls.length
          );
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [open, hospital, imagesLoaded, autoPlay]);

    const handleNext = () => {
      setAutoPlay(false);
      setCurrentImageIndex(
        (prev) => (prev + 1) % hospital.referenceImagesUrls.length
      );
    };

    const handlePrevious = () => {
      setAutoPlay(false);
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + hospital.referenceImagesUrls.length) %
          hospital.referenceImagesUrls.length
      );
    };

    if (!hospital) return null;

    const navigateToGoogleMaps = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: userLat, longitude: userLng } = position.coords;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hospital.latitude},${hospital.longitude}&travelmode=driving`;
            window.open(url, "_blank");
          },
          (error) => {
            toast.warn(
              "Unable to get your location. Showing hospital location instead."
            );
            const url = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
            window.open(url, "_blank");
          }
        );
      } else {
        toast.warn(
          "Geolocation not supported. Showing hospital location instead."
        );
        const url = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
        window.open(url, "_blank");
      }
    };

    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" color="primary" gutterBottom>
            {hospital.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ID: {hospital.id}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Location:</strong> {hospital.location || "N/A"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Pincode:</strong> {hospital.pincode || "N/A"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Address:</strong> {address}
            </Typography>
            {hospital.latitude && hospital.longitude && (
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
            <strong>Admin ID:</strong> {hospital.adminId || "N/A"}
          </Typography>
          {imagesLoaded &&
            hospital.referenceImagesUrls &&
            hospital.referenceImagesUrls.length > 0 && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Reference Images:</strong>
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  {" "}
                  {/* 16:9 ratio */}
                  <AnimatePresence>
                    <motion.div
                      key={currentImageIndex}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={imageAnimation}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <LazyLoadImage
                        src={`data:image/png;base64,${hospital.referenceImagesUrls[currentImageIndex]}`}
                        alt={`Reference ${currentImageIndex + 1}`}
                        effect="blur"
                        width="100%"
                        height="100%"
                        placeholder={
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              bgcolor: "grey.300",
                              borderRadius: 4,
                            }}
                          />
                        }
                        style={{ borderRadius: 4, objectFit: "contain" }} // Fit fully visible
                      />
                    </motion.div>
                  </AnimatePresence>
                  {hospital.referenceImagesUrls.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <IconButton
                        color="primary"
                        onClick={handlePrevious}
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={handleNext}
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </>
            )}
        </Box>
      </Modal>
    );
  }
);

export default HospitalDetailModal;
