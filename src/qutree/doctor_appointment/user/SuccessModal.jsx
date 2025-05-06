import { Box, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SuccessModal = ({ loading, showSuccess }) => {
  return (
    (loading || showSuccess) && (
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
          animation: "fadeIn 0.5s ease-in-out",
        }}
      >
        {loading ? (
          <CircularProgress size={40} color="primary" />
        ) : (
          <CheckCircleIcon sx={{ fontSize: 50, color: "green" }} />
        )}
      </Box>
    )
  );
};

export default SuccessModal;
