import React, { useState } from "react";
import QRCode from "react-qr-code";

const QRCodeWithPopup = ({ qrData, tokenValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Circular QR code container */}
      <div onClick={togglePopup} className=" cursor-pointer ">
        <QRCode value={qrData} size={64} />
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={togglePopup}
          ></div>
          <div className="bg-white rounded-lg p-6 relative z-10 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Token Number: {tokenValue}
            </h3>
            <div className="flex justify-center mb-4">
              <QRCode value={qrData} size={128} />
            </div>
            <button
              onClick={togglePopup}
              className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeWithPopup;
