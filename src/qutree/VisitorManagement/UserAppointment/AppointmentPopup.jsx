import React, { useState, useEffect } from "react";
import SubmitPopup from "./SubmitModel";

const AppointmentPopup = ({
  formData,
  onUpdate,
  onSubmit,
  mode = "preview",
  onGoBackToForm,
  appointments = [],
}) => {
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [isEditable, setIsEditable] = useState(mode === "edit"); // Editable by default in edit mode
  const [editedData, setEditedData] = useState(formData);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Sync editedData with formData when formData changes
  useEffect(() => {
    const effectiveDate = formData.rescheduledDate || formData.appointmentDate;
    const initialData = {
      ...formData,
      date: effectiveDate ? effectiveDate.split("T")[0] : formData.date || "",
      time: effectiveDate
        ? effectiveDate.split("T")[1]?.slice(0, 5)
        : formData.time || "",
    };

    setEditedData(initialData);
  }, [formData]);

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle input changes for date and time
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        alert("Preferred Date cannot be earlier than today");
        return;
      }
      setEditedData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "time") {
      const [hours, minutes] = value.split(":").map(Number);
      const minute = hours * 60 + minutes;
      const minTime = 8 * 60 + 30; // 8:30 AM
      const maxTime = 18 * 60; // 6:00 PM
      if (minute < minTime || minute > maxTime) {
        alert("Select a time between 8:30 AM and 6:00 PM");
        return;
      }
      setEditedData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      const errors = [];
      if (!editedData.date) {
        errors.push("Preferred Date is required");
      }

      if (!editedData.time) {
        errors.push("Preferred Time is required");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const existingAppointment = appointments.find(
        (apt) =>
          apt.companyName === editedData.companyName &&
          apt.date === editedData.date &&
          apt.time === editedData.time &&
          apt.status !== "REJECTED" &&
          apt.id !== editedData.id // Exclude the current appointment
      );

      if (existingAppointment) {
        alert(
          `An appointment already exists for ${editedData.companyName} with the provided date and time. Please choose a different time or date to RESCHEDULE`
        );
        return;
      }
    }
    setShowSubmitPopup(true);
  };

  const handleConfirmSubmit = () => {
    if (isEditable) {
      const updatedData = {
        ...formData, // Preserve original fields
        appointmentDate: `${editedData.date}T${editedData.time}:00`, // Combine date and time
      };
      // console.log("Sending updated data from AppointmentPopup:", updatedData);
      onUpdate(updatedData);
    } else {
      // console.log("Submitting preview data:", formData);
      onSubmit();
    }
  };

  const handleUpdateClick = () => {
    if (mode === "edit" && !isEditable) {
      setIsEditable(true);
    } else if (mode === "preview" && onGoBackToForm) {
      onGoBackToForm();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ marginLeft: isMobile ? "0px" : "240px" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border-2 border-gray-300">
        <h2 className="text-3xl font-semibold mb-4 text-center">Preview</h2>

        <div className="space-y-4">
          {mode === "edit" ? (
            // Only show date and time fields in edit mode
            <div className="flex flex-wrap justify-between gap-4">
              <div className="w-full sm:w-[38%]">
                <label className="font-semibold text-xs">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={editedData.date || ""}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-2 w-full text-xs"
                  required
                />
              </div>

              <div className="w-full sm:w-[38%] mr-5">
                <label className="font-semibold text-xs">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={editedData.time || ""}
                  onChange={handleInputChange}
                  className="border-2 rounded-md p-2 w-full text-xs"
                  required
                />
              </div>
            </div>
          ) : (
            // Full preview mode with all fields (non-editable)
            <>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="w-full sm:w-[43%]">
                  <label className="font-semibold text-xs">Visitor Name</label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {formData.visitorName || "N/A"}
                  </p>
                </div>

                <div className="w-full sm:w-[43%]">
                  <label className="font-semibold text-xs">
                    Contact Number
                  </label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    +91-{formData.contactNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <div className="w-full sm:w-[43%]">
                  <label className="font-semibold text-xs">Email ID</label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {formData.email || "N/A"}
                  </p>
                </div>

                <div className="w-full sm:w-[43%]">
                  <label className="font-semibold text-xs">Company Name</label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {formData.companyName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <div className="w-full sm:w-[43%]">
                  <label className="font-semibold text-xs">
                    Who do you want to meet?
                  </label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {formData.personToMeet || "N/A"}
                  </p>
                </div>

                <div className="w-full sm:w-[43%]">
                  <label className="font-semibold text-xs">
                    Visiting Purpose
                  </label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {formData.purpose || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <div className="w-full sm:w-[38%]">
                  <label className="font-semibold text-xs">
                    Preferred Date
                  </label>
                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {formData.date || "N/A"}
                  </p>
                </div>

                <div className="w-full sm:w-[38%] mr-5">
                  <label className="font-semibold text-xs">
                    Preferred Time
                  </label>

                  <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                    {(() => {
                      if (
                        !formData?.time ||
                        typeof formData.time !== "string"
                      ) {
                        return "Time is not available";
                      }
                      const [hour, minute] = formData.time
                        .split(":")
                        .map(Number);
                      const formattedHour = hour % 12 || 12; // format time from 24 to 12 hours
                      const formattedMinute =
                        minute < 10 ? `0${minute}` : minute;
                      const period = hour >= 12 ? "PM" : "AM";
                      return `${formattedHour}:${formattedMinute} ${period}`;
                    })()}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-xs">Description</label>
                <p className="border-2 rounded-md p-2 bg-gray-100 text-gray-500 text-xs cursor-not-allowed">
                  {formData.description || "N/A"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={
              mode === "edit" && isEditable ? onSubmit : handleUpdateClick
            }
            className="border border-[#066882] text-black text-sm w-32 py-2 rounded-md ml-20"
          >
            {mode === "edit" && isEditable ? "Cancel" : "Update"}
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#066882] text-white text-sm w-32 py-2 rounded-md mr-20"
          >
            {mode === "edit" && isEditable ? "Save" : "Submit"}
          </button>
        </div>

        {showSubmitPopup && <SubmitPopup onClose={handleConfirmSubmit} />}
      </div>
    </div>
  );
};

export default AppointmentPopup;
