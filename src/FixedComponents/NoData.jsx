import React from "react";
import PropTypes from "prop-types";
import { FaExclamationTriangle } from "react-icons/fa";

const NoData = ({ message }) => {
  return (
    <div style={styles.container}>
      <div style={styles.messageBox}>
        <FaExclamationTriangle style={styles.icon} />
        <h2 style={styles.message}>{message || "No Data Available"}</h2>
      </div>
    </div>
  );
};

NoData.propTypes = {
  message: PropTypes.string.isRequired,
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "transparent",
  },
  messageBox: {
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#e6e8e9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    fontSize: "2.5rem",
    color: "#ffcc00",
    marginBottom: "10px",
  },
  message: {
    fontSize: "1.25rem",
    color: "#555555",
  },
};

export default NoData;
