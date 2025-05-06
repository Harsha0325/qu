import React, { useState } from "react";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import Api from "../BaseUrlAPI";
import * as XLSX from "xlsx";
const QRCodeGenerator = ({fetchUnassignedCards}) => {
  const [count, setCount] = useState(10);
  const [userIds, setUserIds] = useState([]);
  const [confirm,setConfirm]=useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWithNfc, setIsWithNfc] = useState(true); // Add state for NFC option
  const baseUrl = "https://quikynet.com/business-card/";

  const generateIds = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = localStorage.getItem("jwtToken");
      const response = await Api.post(
        `/generate-ids?count=${count}&isWithNfc=${isWithNfc}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.data ) {
        setConfirm(true)
        fetchUnassignedCards();
        setUserIds(response.data);
      } else {
        throw new Error("Invalid response from the server.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (userIds.length === 0) {
      setError("No IDs to generate QR codes. Please generate IDs first.");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const qrElements = document.querySelectorAll(".qr-code");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const qrSize = 28;
    let x = margin;
    let y = margin;

    qrElements.forEach((element) => {
      const canvas = element.querySelector("canvas");
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", x, y, qrSize, qrSize);

      y += qrSize + 5; // Add spacing between QR code and ID
      pdf.setFontSize(10); // Reduce font size for the ID
      pdf.text(element.querySelector("p").textContent, x + 2.5, y + 1);
      y -= qrSize + 5; // Reset y position to original

      x += qrSize + margin; // Move to the right
      if (x + qrSize + margin > pageWidth) {
        x = margin; // Reset x to the start
        y += qrSize + margin; // Move to the next row
      }

      // Add a new page if the y exceeds the page height
      if (y + qrSize + margin > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        x = margin;
        y = margin;
      }
    });

    pdf.text(`Start ID: ${userIds[0]}`, margin, y + qrSize + 10 );
    pdf.text(`End ID: ${userIds[userIds.length - 1]}`, margin, y + qrSize + 20);

    pdf.save("QR_Codes.pdf");
  };

  const downloadExcel = () => {
    if (userIds.length === 0) {
      setError("No IDs to generate the Excel sheet. Please generate IDs first.");
      return;
    }

    const data = userIds.map((id, index) => ({
      "Sr. No.": index + 1,
      "Complete Link": `${baseUrl}${id}`,
      "User ID": id,
      "NFC Status": isWithNfc ? "With NFC" : "Without NFC",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QR Details");
    XLSX.writeFile(workbook, "QR_Details.xlsx");
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-5">QR Code Generator</h2>

            <div className="mb-5">
            <div className="mb-5 flex items-center">
        <label className="mr-3 text-lg font-medium">Select Count:</label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[10, 20, 50, 100].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <div className="ml-6 flex items-center">
          <label className="mr-3 text-lg font-medium">Select Option:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isWithNfc}
              onChange={() => setIsWithNfc(!isWithNfc)}
            />
            <span className="slider round"></span>
          </label>
          <span className="ml-2">{isWithNfc ? "With NFC" : "Without NFC"}</span>
        </div>
      </div>

        <button
          onClick={generateIds}
          className="ml-4 px-4 py-2 bg-gradient-to-r from-[#016681] to-[#0CBFFF] text-white rounded shadow hover:bg-gradient-to-r hover:from-[#016681] hover:to-[#0CBFFF]"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate IDs"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-5">{error}</p>}

      <div
        id="qr-container"
        className="grid-cols-2 md:grid-cols-4 gap-4 hidden"
      >
        {userIds.map((userId) => (
          <div
            key={userId}
            className="qr-code flex flex-col items-center p-4 border rounded shadow"
          >
            <QRCode value={`${baseUrl}${userId}`} size={128} />
            <p className="mt-2 text-sm">{userId}</p>
          </div>
        ))}
      </div>
      {confirm && (
        <div className="text-green-500 font-medium mt-4">
          Your cards are successfully created. Please download them using the button below.
        </div>
      )}

      {userIds.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={downloadPDF}
          className="mt-6 px-4 py-2 bg-gradient-to-r from-[#016681] to-[#0CBFFF] text-white rounded shadow hover:bg-gradient-to-r hover:from-[#016681] hover:to-[#0CBFFF]"
        >
          Download QR Codes as PDF
        </button>
         <button
         onClick={downloadExcel}
         className="mt-6 px-4 py-2 bg-gradient-to-r from-[#016681] to-[#0CBFFF] text-white rounded shadow hover:bg-gradient-to-r hover:from-[#016681] hover:to-[#0CBFFF]"
       >
         Download QR Details as Excel
       </button></div>
      )}
    </div>
  );
};

export default QRCodeGenerator;