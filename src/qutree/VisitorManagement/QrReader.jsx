import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import "./QrReader.css";
// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../../image/qr-frame.svg";

const QrReader = () => {
  const navigate = useNavigate(); 
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const visitorURL = `https://quikynet.com/visitor/check-in`;

  const onScanSuccess = (result) => {
    console.log(result);
    const scannedData = result?.data?.trim();
    const baseUrl = new URL(scannedData).origin;
    const visitorBaseUrl = `${baseUrl}/visitor/check-in`;
 
    // Compare the scanned result with the visitorURL
    if (visitorBaseUrl === visitorURL.trim()) {
      const userId = localStorage.getItem('userId');
      const newScannedResult = `${scannedData}&userId=${userId}`;
      setScannedResult(newScannedResult); 

    } else {
      setScannedResult(scannedData); // Set the scanned result as it is
    }

    setIsModalOpen(true); // Open the modal
  };
  const onScanFail = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      const videoElement = videoEl.current;
      scanner.current = new QrScanner(videoElement, onScanSuccess, {


        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });

      return () => {
        if (videoElement) {
          scanner.current?.stop();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!qrOn) {
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
    }
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {/* Back Arrow to go to the previous page */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)} // Navigate back on click
      >
       <GoArrowLeft style={{color: "#ECEEEE" , padding: "8px", borderRadius: "50%", backgroundColor: "#035E7B"}} />
      </div>

      {/* QR Video */}
      <video ref={videoEl} style={{ width: "100%", height: "auto" }}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>

      {/* Modal for scanned result */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#091416",
            borderTop: "1px solid #091416",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1001,
            padding: "20px",
            textAlign: "start",
          }}
        >
          {/* Close Icon */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              cursor: "pointer",
              fontSize: "20px",
            }}
            onClick={() => setIsModalOpen(false)} // Close modal on click
          >
            ✖
          </span>

          {/* Modal Content */}
          <div style={{color: "#ECEEEE", textAlign: "start"}}>You are redirecting to the below link</div>
          <p style={{ color: "#56666A", wordBreak: "break-all", textAlign: "start"}}>
            {scannedResult}
          </p>

          {/* Button to open the scanned link */}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#035E7B",
              color: "#ECEEEE",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "20px",
              width: "100%"
            }}
            onClick={() => window.location.href = scannedResult} // Redirect to scanned result URL
          >
            Open Link
          </button>
        </div>
      )}

      {/* Overlay to disable the page when the modal is open */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        ></div>
      )}
    </div>
  );
};

export default QrReader;
