import { BiTimeFive } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import Loading from "../../../FixedComponents/Loading";
import React, { useEffect, useState } from "react";
import AppointmentPopup from "./AppointmentPopup";
import Api from "../../api";

const AppointmentList = ({
  appointments = [],
  onCancel,
  onUpdate,
  onReschedule,
  companyList,
  refreshTrigger,
}) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appdata, setAppdata] = useState(appointments);

  const newuserId = localStorage.getItem("userId");

  useEffect(() => {
    setAppdata(appointments);
  }, [appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint;
      if (activeTab === "Upcoming")
        endpoint = `/user/${newuserId}/upcoming-appointment`;
      else if (activeTab === "History")
        endpoint = `/user/${newuserId}/completed-appointment`;
      else if (activeTab === "Cancelled")
        endpoint = `/user/${newuserId}/rejected-appointment`;

      const response = await Api.get(endpoint);

      const data = response.data;

      if (!data) {
        setAppdata([]);
        onUpdate([]);
        return;
      }

      const mappedData = data.map((item) => {
        const effectiveDate = item.rescheduledDate || item.appointmentDate;
        return {
          id: item.id,
          fullName: item.visitorName || item.fullName,
          contactNumber: item.contactNumber || item.phoneNumber,
          email: item.email,
          companyName: item.companyName || companyList[0],
          assignedUser: item.personToMeet || item.assignedUser || "",
          purpose: item.purpose,
          appointmentDate: item.appointmentDate,
          rescheduledDate: item.rescheduledDate,
          date: effectiveDate ? effectiveDate.split("T")[0] : "N/A",
          time: effectiveDate
            ? effectiveDate.split("T")[1]?.slice(0, 5)
            : "N/A",
          status: item.status || "PENDING",
          city: item.city || "N/A",
          state: item.state || "N/A",
        };
      });

      setAppdata(mappedData);
      onUpdate(mappedData);
    } catch (err) {
      if (err.response?.status === 404) {
        setAppdata([]);
        onUpdate([]);
      } else {
        const errorMsg =
          err.response?.data?.message ||
          `Failed to fetch ${activeTab} appointments: ${err.message}`;
        setError(errorMsg);
        setAppdata([]);
        onUpdate([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, refreshTrigger]);

  const isPastAppointment = (appointment) => {
    const effectiveDate =
      appointment.rescheduledDate || appointment.appointmentDate;
    const appointmentDateTime = new Date(effectiveDate);
    const now = new Date();
    // console.log(
    //   `Checking if ${effectiveDate} is past ${now}: ${
    //     appointmentDateTime < now
    //   }`
    // );
    return appointmentDateTime < now;
  };

  const filteredAppointments = appdata
    .filter((a) => {
      const isPast = isPastAppointment(a);
      if (activeTab === "Upcoming") {
        return ["PENDING", "RESCHEDULED"].includes(a.status) && !isPast;
      }
      if (activeTab === "History") {
        return (
          (["PENDING", "RESCHEDULED"].includes(a.status) && isPast) ||
          a.status === "REJECTED"
        );
      }
      if (activeTab === "Cancelled") {
        return a.status === "REJECTED";
      }
      return false;
    })
    .filter((a) => {
      if (!search) return true;
      const assignedUser = a.assignedUser || "";
      return assignedUser.toLowerCase().includes(search.toLowerCase());
    });

  const handleEditClick = (appointment) => {
    setEditingAppointment({ ...appointment });
    setTimeout(() => setShowEditPopup(true), 0);
  };

  const handleSaveEdit = (updatedAppointment) => {
    // console.log(
    //   "Received updated appointment in handleSaveEdit:",
    //   updatedAppointment
    // );
    const updatedAppdata = appdata.map((apt) =>
      apt.id === updatedAppointment.id
        ? {
            ...apt,
            rescheduledDate: updatedAppointment.appointmentDate,
            date: updatedAppointment.appointmentDate.split("T")[0],
            time: updatedAppointment.appointmentDate.split("T")[1]?.slice(0, 5),
            status: "RESCHEDULED",
            city: updatedAppointment.city || apt.city, // Preserve city
            state: updatedAppointment.state || apt.state, // Preserve state
          }
        : apt
    );
    setAppdata(updatedAppdata);
    onReschedule(updatedAppointment).then(() => {
      fetchAppointments();
    });

    setShowEditPopup(false);
    setEditingAppointment(null);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setEditingAppointment(null);
  };

  return (
    <div className="p-4 sm:p-1 min-h-screen w-full">
      {loading && <Loading />}
      {error && <div className="text-red-500">Error: {error}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ml-[-10px]">
        <div className="flex border-gray-300 border rounded-md text-xs w-full sm:w-auto overflow-x-auto">
          {["Upcoming", "History", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 sm:flex-none px-4 py-2 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gradient-to-br from-[#066882] to-[#00caff] text-white"
                  : "border-r border-gray-300 last:border-r-0"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-1/3 max-w-[300px] mr-[-30px]">
          <AiOutlineSearch className="absolute mt-[10px] ml-4" />
          <input
            type="text"
            placeholder="Search by employee name"
            className="p-2 pl-10 border rounded-md text-xs w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 mt-3 overflow-x-auto">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const effectiveDate =
              appointment.rescheduledDate || appointment.appointmentDate;
            const displayStatus =
              appointment.status === "Cancelled" && appointment.previousStatus
                ? appointment.previousStatus
                : appointment.status;

            return (
              <div
                key={appointment.id}
                className="bg-white p-4 border-gray-300 border-b flex flex-row  items-center sm:justify-between gap-16"
              >
                <div className="text-center p-2 rounded-lg shadow-lg w-14 flex-shrink-0">
                  <p className="font-bold text-sm text-[#242C30]">
                    {new Date(effectiveDate).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p className="font-bold text-2xl text-[#242C30]">
                    {new Date(effectiveDate).getDate()}
                  </p>
                </div>

                <div className="w-[220px] flex-shrink-0">
                  <p className="text-gray-700 font-semibold text-sm flex items-center gap-1">
                    <BiTimeFive color="black" />
                    {(() => {
                      const hours = new Date(effectiveDate).getHours();
                      const minutes = new Date(effectiveDate).getMinutes();
                      const formattedHour = hours % 12 || 12; // Convert to 12-hour
                      const formattedMinute =
                        minutes < 10 ? `0${minutes}` : minutes; // Pad with 0
                      const period = hours >= 12 ? "PM" : "AM"; // AM/PM
                      return `${formattedHour}:${formattedMinute} ${period}`;
                    })()}
                  </p>

                  <div className="flex">
                    <div>
                      <IoLocationSharp color="black" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {appointment.companyName} | {appointment.city},{" "}
                        {appointment.state}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-[10px] font-semibold rounded-full ${
                      activeTab === "History" &&
                      (appointment.status === "PENDING" ||
                        appointment.status === "RESCHEDULED")
                        ? "bg-gradient-to-br from-[#066882] to-[#00caff] text-white"
                        : activeTab === "Cancelled" &&
                          (appointment.status === "PENDING" ||
                            appointment.status === "RESCHEDULED")
                        ? "bg-gradient-to-br from-[#066882] to-[#00caff] text-white"
                        : "bg-gradient-to-br from-[#066882] to-[#00caff] text-white"
                    }`}
                  >
                    {displayStatus}
                  </span>
                </div>

                <div className="w-[150px] flex-shrink-0">
                  <p className="text-gray-500 text-xs">With</p>
                  <p className="font-semibold text-[#066882] text-sm">
                    {appointment.assignedUser || "NA"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-[26px] w-auto">
                  {activeTab === "Upcoming" &&
                    ["PENDING"].includes(appointment.status) && (
                      <button
                        className="px-4 py-1 bg-[#066882] text-white rounded-md text-sm w-auto"
                        onClick={() => {
                          handleEditClick(appointment);
                        }}
                      >
                        Edit
                      </button>
                    )}

                  {appointment.status === "RESCHEDULED" ? (
                    <span
                      className={` py-1 text-sm border border-[#066882] rounded-md 
                   ${activeTab === "History" ? "px-2" : "px-9"}`}
                    >
                      Rescheduled
                    </span>
                  ) : (
                    <button
                      className={`px-4 py-1 rounded-md text-sm w-auto ${
                        appointment.status === "REJECTED"
                          ? "bg-white text-red-500 border-red-500 border"
                          : activeTab === "History" &&
                            (appointment.status === "PENDING" ||
                              appointment.status === "RESCHEDULED")
                          ? "bg-white border-[#066882] border text-black"
                          : appointment.status === "PENDING"
                          ? "bg-white border border-[#066882] text-black"
                          : "bg-white text-black"
                      }`}
                      onClick={() =>
                        onCancel(appointment.id, appointment.companyId || 1)
                      }
                      disabled={
                        activeTab === "History" &&
                        (appointment.status !== "PENDING" ||
                          appointment.status !== "RESCHEDULED")
                      }
                    >
                      {appointment.status === "REJECTED"
                        ? "Cancelled"
                        : activeTab === "History" &&
                          appointment.status === "PENDING"
                        ? "Completed"
                        : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">
            {search
              ? `No appointments found matching "${search}" in ${activeTab} tab.`
              : `No appointments available for ${activeTab} tab.`}
          </p>
        )}
      </div>

      {showEditPopup && editingAppointment && (
        <AppointmentPopup
          formData={editingAppointment}
          onUpdate={handleSaveEdit}
          onSubmit={handleClosePopup}
          mode="edit"
          companyList={companyList}
          initialCompany={editingAppointment.companyName}
          initialEmployee={editingAppointment.personToMeet}
          appointments={appointments}
        />
      )}
    </div>
  );
};
export default AppointmentList;
