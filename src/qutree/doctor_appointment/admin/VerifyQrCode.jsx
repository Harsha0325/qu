// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Card,
//   CircularProgress,
// } from "@mui/material";
// import axios from "@axios";
// import { toast } from "react-toastify";

// function VerifyQrCode() {
//   const [qrCode, setQrCode] = useState("");
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!qrCode) {
//       toast.error("Please enter a QR code!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/appointments/verify", qrCode, {
//         headers: { "Content-Type": "text/plain" },
//       });
//       setResponse(res.data);
//       toast.success("QR Code verified successfully!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error verifying QR code");
//       setResponse(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card sx={{ p: 4, maxWidth: 600, mx: "auto", boxShadow: 3 }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Verify QR Code
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="QR Code Data"
//           value={qrCode}
//           onChange={(e) => setQrCode(e.target.value)}
//           fullWidth
//           margin="normal"
//           placeholder="e.g., token=1,date=2025-02-21,time=15:00,doctor=Dr. Arjun"
//         />
//         <Box sx={{ textAlign: "center", mt: 2 }}>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Verify"}
//           </Button>
//         </Box>
//       </form>
//       {response && (
//         <Box sx={{ mt: 3, textAlign: "center" }}>
//           <Typography variant="h6" color="success.main">
//             Verification Successful
//           </Typography>
//           <Typography>Status: {response.status}</Typography>
//         </Box>
//       )}
//     </Card>
//   );
// }

// export default VerifyQrCode;
