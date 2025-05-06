import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

function VisitorQRCode() {
  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const visitorURL = `${window.location.origin}/visitor/check-in`;
  const handleGenerateQrCode = () => {
    setQrValue(visitorURL);
  };

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const canvasWithPadding = document.createElement("canvas");
      const padding = 5;
      canvasWithPadding.width = canvas.width + padding * 2;
      canvasWithPadding.height = canvas.height + padding * 2;

      const ctx = canvasWithPadding.getContext("2d");
      ctx.fillStyle = "#ffffff"; // white background
      ctx.fillRect(0, 0, canvasWithPadding.width, canvasWithPadding.height);
      ctx.drawImage(canvas, padding, padding);

      const link = document.createElement("a");
      const dataUrl = canvasWithPadding.toDataURL("image/png");
      link.href = dataUrl;
      link.download = "Qugates-visitor-QR.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateAndDownload = () => {
    handleGenerateQrCode();
    setTimeout(handleDownload, 100);
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: "1024px",
        marginLeft: isMobile ? "0px" : "240px",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "10px",
        padding: "10px"
      }}
    >
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: "24px",
          marginTop: "15px",
          color: "#242c30",
          textAlign: "start",
        }}
      >
       <GoArrowLeft onClick={() => navigate(-1)} style={{color: "#6E7172"}} /> Visitor Management
      </div>
      <div
        style={{
          fontFamily: "Archivo",
          fontSize: "18px",
          color: "#242c30",
          textAlign: "start",
        }}
      >
        Effortlessly monitor and record guest check-ins and check-outs.
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "38px",
          marginTop: "50px",
          marginBottom: "100px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: isMobile ? "320px" : "224.44px",
            backgroundColor: "#f7f7f7",
            padding: "16px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "Archivo",
              fontSize: "18px",
              marginBottom: "32px",
              color: "#242c30",
              textAlign: "center",
            }}
          >
            Download and display the QR code below at your entrance to streamline visitor check-in.
          </div>

          <div ref={qrRef}>
            <QRCodeCanvas
              style={{
                width: "146.353px",
                height: "145.913px",
                padding: "16px",
              }}
              value={qrValue}
            />
          </div>

          <button
            onClick={handleGenerateAndDownload}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#035e7b",
              color: "white",
              border: "none",
              marginTop: "24px",
            }}
          >
            Download QR Code
          </button>
        </div>

        <div
          style={{
            maxWidth: "100%",
            width: isMobile ? "320px" : "400.56px",
            padding: "5px",
          }}
        >
          <div
            style={{
              fontFamily: "Archivo",
              fontSize: "32px",
              marginBottom: "16px",
              color: "#242c30",
            }}
          >
            How it Works
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: "18px" }}>
            1. Download the QR Code:
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginLeft: "12px",
              marginBottom: "13px",
              marginTop: "8px",
              color: "#242c30",
              lineHeight: "1.2",
            }}
          >
            "Download QR code" to get a unique visitor's card.
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: "18px" }}>
            2. Display at Entrance:
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginLeft: "12px",
              marginBottom: "13px",
              marginTop: "8px",
              color: "#242c30",
              lineHeight: "1.2",
            }}
          >
            Print and place your code at the organization's entrance.
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: "18px" }}>
            3. Visitor Scans the Code:
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginLeft: "12px",
              marginBottom: "13px",
              marginTop: "8px",
              color: "#242c30",
              lineHeight: "1.2",
            }}
          >
            Guests scan the code using their smartphones - QuickyNet members use the app, others use their cameras.
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: "18px" }}>
            4. Complete the Form:
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginLeft: "12px",
              marginBottom: "13px",
              marginTop: "8px",
              color: "#242c30",
              lineHeight: "1.2",
            }}
          >
            Visitors fill out their QuickyNet ID, name, purpose, contact number, and email.
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: "18px" }}>
            5. Check-in:
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginLeft: "12px",
              marginBottom: "13px",
              marginTop: "8px",
              color: "#242c30",
              lineHeight: "1.2",
            }}
          >
            Once the form is submitted, their visit is logged, streamlining the check-in process and enhancing security.
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitorQRCode;
