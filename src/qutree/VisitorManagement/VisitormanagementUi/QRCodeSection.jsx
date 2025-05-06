import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

import Loading from "../../../FixedComponents/Loading";
import useCompanyId from "../useCompanyId";
const QRCodeSection = () => {
  const qrRef = useRef(null);

  const { companyId, loading, error } = useCompanyId();

  const visitorURL = `https://quikynet.com/visitor/check-in`;
  const visitorQRURL = companyId ? `${visitorURL}?companyId=${companyId}` : "";

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
  
    const padding = 10; // Adjust padding as needed
    const qrSize = canvas.width;
    const newSize = qrSize + 2 * padding;
  
    // Create a new canvas with padding
    const paddedCanvas = document.createElement("canvas");
    paddedCanvas.width = newSize;
    paddedCanvas.height = newSize;
    const ctx = paddedCanvas.getContext("2d");
  
    // Fill background with white
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, newSize, newSize);
  
    // Draw the QR code in the center
    ctx.drawImage(canvas, padding, padding, qrSize, qrSize);
  
    // Convert to image and download
    const url = paddedCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitor-check-in-qr.png";
    a.click();
  };
  

  if(loading){
    return <div> <Loading /></div>
  }
  if(error){
    return <div className="flex justify-center items-center"> {error}</div>
  }

  return (
    <>
      <div className="self-start text-sm leading-1 text-zinc-500">
        Download and display the QR code below at your entrance to streamline{" "}
        <br />
        visitor check-in
      </div>
      <div className="flex flex-col justify-center mt-8 w-full text-sm font-medium leading-none text-white max-w-[192px]">
        <div ref={qrRef} className="self-center border-2 p-3 rounded-2xl">
          <QRCodeCanvas
            value={visitorQRURL}
            size={260}
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            level={"L"}
          />
        </div>
        <div className="flex items-start mt-6 w-full">
          <button
            className="overflow-hidden flex-1 shrink gap-2 self-stretch px-5 py-4 w-full bg-sky-800 rounded-2xl"
            aria-label="Download QR Code"
            onClick={downloadQRCode}
          >
            Download QR Code
          </button>
        </div>
      </div>
    </>
  );
};

export default QRCodeSection;
