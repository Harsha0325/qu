import React from "react";
import HowItWorksStep from "./HowItWorksStep";
import QRCodeSection from "./QRCodeSection";

const steps = [
  {
    number: "1",
    title: "Download the QR Code",
    description: '"Download QR Code" to get your unique visitor QR code.',
  },
  {
    number: "2",
    title: "Display at Entrance",
    description: "Print and place the QR code at your organization's entrance.",
  },
  {
    number: "3",
    title: "Visitor Scans the Code",
    description:
      "Guests scan the code using their smartphones—QuikyNet members use the app, others use their camera.",
  },
  {
    number: "4",
    title: "Complete the Form",
    description:
      "Visitors fill out their QuikyNet ID, name, purpose, contact number, and email.",
  },
  {
    number: "5",
    title: "Check-In",
    description:
      "Once the form is submitted, their visit is logged, streamlining the check-in process and enhancing security.",
  },
];

function VisitorsManagement() {
  return (
    <div className="flex flex-col items-center px-6 py-12 md:py-16 bg-gradient-to-b  min-h-screen">
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-gray-900 text-center">
        Visitors Management
      </h2>
      <p className="text-gray-600 mt-2 text-lg text-center">
        A seamless and secure way to manage visitor check-ins.
      </p>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-10 mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200 max-w-5xl w-full">
        {/* QR Code Section */}
        <div className="flex flex-col items-center text-center bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-300 w-full md:w-1/3">
          <h3 className="text-xl font-semibold text-gray-800">
            Your Unique QR Code
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Scan this code to check-in instantly
          </p>
          <QRCodeSection />
        </div>

        {/* Steps Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            How It Works
          </h3>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <HowItWorksStep
                key={index}
                {...step}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitorsManagement;
