import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BrowserQRCodeReader } from "@zxing/library"; // ZXing QR reader
import { toast } from "react-toastify";

const QrScannerDummy = () => {
  const [openScanner, setOpenScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [manualQrInput, setManualQrInput] = useState("");
  const videoRef = useRef(null);
  const qrReader = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
        const backCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear")
        );
        setCameraId(
          backCamera ? backCamera.deviceId : videoDevices[0]?.deviceId
        );
      } catch (err) {
        console.error("Error enumerating devices:", err);
        toast.error("Unable to access cameras");
      }
    };
    getCameras();
  }, []);

  const startCamera = async () => {
    if (videoRef.current && cameraId) {
      try {
        const qrCodeReader = new BrowserQRCodeReader();
        qrReader.current = qrCodeReader;

        setScanning(true);
        const result = await qrCodeReader.decodeFromVideoDevice(
          cameraId,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleQrScan(result.getText());
            }
            if (error && error.name !== "NotFoundError") {
              console.error("Scanning error:", error);
            }
          }
        );
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        toast.error("Error starting scanner: " + err.message);
        setScanning(false);
      }
    } else {
      toast.error("No camera selected or available");
    }
  };

  const stopCamera = () => {
    if (qrReader.current) {
      qrReader.current.stopContinuousDecode();
      qrReader.current.reset();
      qrReader.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleQrScan = (data) => {
    if (data) {
      toast.success(`Scanned QR Code: ${data}`);
      stopCamera();
      setOpenScanner(false);
    }
  };

  const handleManualQrSubmit = () => {
    if (manualQrInput) {
      handleQrScan(manualQrInput);
      setManualQrInput("");
    } else {
      toast.warn("Please enter a QR code value");
    }
  };

  const openQrScanner = () => {
    setOpenScanner(true);
    setTimeout(startCamera, 100); // Delay to ensure DOM is ready
  };

  const closeQrScanner = () => {
    stopCamera();
    setOpenScanner(false);
  };

  const switchCamera = () => {
    const currentIndex = devices.findIndex(
      (device) => device.deviceId === cameraId
    );
    const nextIndex = (currentIndex + 1) % devices.length;
    setCameraId(devices[nextIndex].deviceId);
    stopCamera();
    startCamera();
    toast.info(`Switched to ${devices[nextIndex].label || "other"} camera`);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: "1200px",
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Dummy QR Scanner
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={openQrScanner}
        sx={{ mb: 2, width: { xs: "100%", sm: "auto" } }}
      >
        Open QR Scanner
      </Button>

      {/* QR Scanner Dialog */}
      <Dialog
        open={openScanner}
        onClose={closeQrScanner}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>Scan QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative", width: "100%", paddingTop: "100%" }}>
            <video
              ref={videoRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          {scanning && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Scanning...</Typography>
            </Box>
          )}
          <TextField
            label="Enter QR Code Manually"
            value={manualQrInput}
            onChange={(e) => setManualQrInput(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={switchCamera}
              disabled={devices.length <= 1}
              fullWidth={isMobile}
            >
              Switch Camera
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleManualQrSubmit}
              fullWidth={isMobile}
            >
              Submit Manual QR
            </Button>
            <Button
              variant="outlined"
              onClick={closeQrScanner}
              fullWidth={isMobile}
            >
              Cancel Scan
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QrScannerDummy;
