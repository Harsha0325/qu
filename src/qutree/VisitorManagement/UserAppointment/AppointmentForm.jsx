import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import Appointment from "./AppointmentList";
import AppointmentPopup from "./AppointmentPopup";
import Api from "../../api";
import Loading from "../../../FixedComponents/Loading";

const AppointmentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [tempAppointment, setTempAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [name, setName] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [email, setEmail] = useState("");
  const [visit, setVisit] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userId = localStorage.getItem("userId");

  // Fetch company list from API
  const fetchCompanyList = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/companies");
      setCompanyList(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch company list");
      setCompanyList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyList(); // Fetch companies when component mounts
    fetchUpcomingAppointments();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // take-appointment Api
  const createAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        fullName: appointmentData.visitorName,
        email: appointmentData.email,
        phoneNumber: appointmentData.contactNumber.replace(/\D/g, ""),
        appointmentDate: `${appointmentData.date}T${appointmentData.time}:00`,
        purpose: appointmentData.purpose,
        assignedUser: appointmentData.personToMeet,
        userId: userId,
        companyId: appointmentData.companyId,
      };

      const response = await Api.post(
        `/take-appointment?companyId=${appointmentData.companyId}`,
        body
      );

      setRefreshTrigger((prev) => prev + 1); // Trigger refresh after creation

      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create appointment";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // reject-appointment Api
  const rejectAppointment = async (appointmentId, companyId) => {
    setLoading(true);
    try {
      const response = await Api.put(
        `/appointment/${appointmentId}/reject?companyId=${companyId}`
      );

      if (response.status >= 400) {
        throw new Error(`Failed to reject appointment: ${response.status}`);
      }

      await fetchUpcomingAppointments();

      return response.data; // Optional: return data if needed
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to reject appointment"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // reschedule-appointment api
  const rescheduleAppointment = async (appointmentId, companyId, newDate) => {
    setLoading(true);
    try {
      const formattedNewDate = newDate.includes("T")
        ? newDate
        : `${newDate}T00:00:00`;

      const response = await Api.put(
        `/appointment/${appointmentId}/reschedule?companyId=${companyId}&newDate=${formattedNewDate}`
      );

      // console.log("Full response from reschedule:", response);

      if (response.status >= 400) {
        throw new Error(`Failed to reschedule appointment: ${response.status}`);
      }
      return response.data || {}; // Fallback to empty object if data is missing
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to reschedule appointment";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // /upcoming-appointment api
  const fetchUpcomingAppointments = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/user/${userId}/upcoming-appointment`);

      if (response.status === 404) {
        setAppointments([]);
        return;
      }

      if (response.status >= 400) {
        throw new Error(
          `Failed to fetch upcoming appointments: ${response.status}`
        );
      }

      const data = response.data;
      const mappedData = data.map((item) => {
        const company = companyList.find((c) => c.name === item.companyName);
        const companyId = item.companyId || (company ? company.id : 1);
        const effectiveDate = item.rescheduledDate || item.appointmentDate;
        return {
          id: item.id,
          fullName: item.visitorName || item.fullName,
          phoneNumber: item.contactNumber || item.phoneNumber,
          email: item.email,
          companyName: item.companyName,
          companyId: companyId,
          assignedUser: item.personToMeet || item.assignedUser,
          purpose: item.purpose,
          appointmentDate: item.appointmentDate,
          rescheduledDate: item.rescheduledDate,
          date: effectiveDate ? effectiveDate.split("T")[0] : "N/A",
          time: effectiveDate
            ? effectiveDate.split("T")[1]?.slice(0, 5)
            : "N/A",
          status: item.status || "Requested by you",
        };
      });

      // console.log("Mapped appointments:", mappedData);

      setAppointments(mappedData);
    } catch (err) {
      setError(err.message || "Failed to fetch upcoming appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // const refreshAppointments = () => {
  //   setRefreshTrigger((prev) => prev + 1);
  // };

  const onSubmit = (data) => {
    const selectedCompanyObj = companyList.find(
      (company) => company.name === selectedCompany
    );
    const companyId = selectedCompanyObj ? selectedCompanyObj.id : 1;

    const newAppointment = {
      visitorName: name,
      contactNumber: formattedPhone,
      email,
      companyName: selectedCompany,
      companyId: companyId,
      personToMeet: selectedEmployee,
      purpose: visit,
      date,
      time: time || "00:00",
      description: data.description || "N/A",
      status: "Requested by you",
    };

    // Check for existing appointment with same company, date, and time
    const existingAppointment = appointments.find(
      (apt) =>
        apt.companyName === newAppointment.companyName &&
        apt.date === newAppointment.date &&
        apt.time === newAppointment.time &&
        apt.status !== "REJECTED" // Ignore cancelled appointments
    );

    if (existingAppointment) {
      alert(
        `An Appointment already exists for ${newAppointment.companyName} with the provided date and time . Please choose a different date or time.`
      );
      return; // Prevent proceeding to popup
    }

    setTempAppointment(newAppointment);
    setShowPopup(true);
  };

  const handlePopupSubmit = async () => {
    if (!tempAppointment) return;

    try {
      await createAppointment(tempAppointment);

      await fetchUpcomingAppointments(); // Refresh after success

      setShowPopup(false);
      setShowForm(false);
      setTempAppointment(null);
      resetForm();

      await handleUpdate(tempAppointment, true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (updatedAppointment, isNewAppointment = false) => {
    if (updatedAppointment && updatedAppointment.id) {
      const company = companyList.find(
        (c) => c.name === updatedAppointment.companyName
      );

      const companyId =
        updatedAppointment.companyId || (company ? company.id : 1); // Use stored ID or match from companyList, fallback to 1
      // console.log("Calling rescheduleAppointment with:", {
      //   id: updatedAppointment.id,
      //   companyId,
      //   newDate: updatedAppointment.appointmentDate,
      // });

      try {
        await rescheduleAppointment(
          updatedAppointment.id,

          companyId,
          updatedAppointment.appointmentDate
        );

        await fetchUpcomingAppointments();
      } catch (err) {}
    }
    setShowPopup(false);
    if (isNewAppointment) {
      setShowForm(false);
    }
    setTempAppointment(null);
  };

  const handleCancelAppointment = (appointmentId) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);

    if (appointment) {
      const company = companyList.find(
        (c) => c.name === appointment.companyName
      );
      const companyId = appointment.companyId || (company ? company.id : 1);

      rejectAppointment(appointmentId, companyId)
        .then(() => {
          const updatedAppointments = appointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
          );
          setAppointments(updatedAppointments);
        })
        .catch((err) => {});
    }
  };

  const resetForm = () => {
    setName("");
    setFormattedPhone("");
    setEmail("");
    setVisit("");
    setDate(new Date().toISOString().split("T")[0]);
    setTime("");
    setSelectedCompany("");
    setSelectedEmployee("");
    reset();
  };

  const handleName = (e) => {
    const names = e.target.value.replace(/[^a-zA-Z.\s]/g, "");
    if (names.length > 30) {
      alert("Enter Valid Name");
      setName("");
    } else {
      setName(names);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d+)/, "$1-$2");
    if (value.length !== 11 && value.length > 11) {
      alert("Phone number must be exactly 10 digits");
      setFormattedPhone("");
    } else {
      setFormattedPhone(value);
    }
  };

  const handleEmail = (e) => {
    const email = e.target.value;
    if (email.length > 40) {
      alert("Enter Valid Email");
      setEmail("");
    } else {
      setEmail(email);
    }
  };

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setSelectedCompany(value);
  };

  const handleVisit = (e) => {
    const visit = e.target.value.replace(/[^a-zA-Z.\s]/g, "");
    if (visit.length > 50) {
      alert("Enter Valid Visiting Purpose");
      setVisit("");
    } else {
      setVisit(visit);
    }
  };

  const handleDate = (e) => {
    const date = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      alert("Enter Valid Date");
      setDate(today);
    } else {
      setDate(date);
    }
  };

  const handleTime = (e) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(":").map(Number);
    const selectedMinutes = hours * 60 + minutes;
    const minTime = 8 * 60 + 30;
    const maxTime = 18 * 60;
    const today = new Date().toISOString().split("T")[0];
    const currentDate = date;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentDate === today && selectedMinutes < currentMinutes) {
      alert("Selected time cannot be earlier than the current time for today!");
      setTime("");
      return;
    }

    if (selectedMinutes < minTime || selectedMinutes > maxTime) {
      alert("Select a time between 8:30 AM and 6:00 PM");
      setTime("");
    } else {
      setTime(time);
    }
  };

  const handleEmployeeChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z.\s]/g, ""); // Allow only letters, dots, and spaces
    if (value.length > 30) {
      alert("Name must be 30 characters or less");
    } else {
      setSelectedEmployee(value);
    }
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen p-4"
      style={{ marginLeft: isMobile ? "0px" : "240px" }}
    >
      {loading && <Loading />}
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div className="bg-white rounded-lg w-full p-4 flex justify-between items-center ml-[-60px]">
        <p className="text-[#242c30] text-2xl font-semibold">
          {!showForm ? "Appointments" : "Request Appointment"}
        </p>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center text-xs font-semibold px-5 py-2 rounded-md border border-[#066882] transition-all mr-[-70px]
            ${
              !showForm ? "bg-[#066882] text-white" : "bg-white text-black"
            } w-40 sm:w-48 md:w-52`}
        >
          {showForm ? (
            <Minus className="mr-1 flex-shrink-0" size={17} />
          ) : (
            <Plus className="mr-1 flex-shrink-0" size={17} />
          )}
          <span className="truncate">Request Appointment</span>
        </button>
      </div>

      {!showForm && (
        <Appointment
          appointments={appointments}
          onCancel={handleCancelAppointment}
          onUpdate={(updatedAppointments) =>
            setAppointments(updatedAppointments)
          }
          onReschedule={handleUpdate}
          companyList={companyList}
          refreshTrigger={refreshTrigger}
          userId={userId}
        />
      )}

      {showForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mt-4">
          <h1 className="text-center text-2xl font-bold mb-6">
            Request Appointment
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-semibold">
                Visitor Name <span className="text-red-600">*</span>
              </label>
              <input
                {...register("visitorName", { required: "Name is required" })}
                type="text"
                placeholder="Enter your Full Name"
                className="w-full border-2 p-2 rounded-md"
                value={name}
                onChange={handleName}
                required
              />
              {errors.visitorName && (
                <p className="text-red-600 text-sm">
                  {errors.visitorName.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                {...register("contactNumber", {
                  required: "Contact number is required",
                  validate: (value) =>
                    value.replace(/\D/g, "").length === 10 ||
                    "Must be 10 digits",
                })}
                type="tel"
                placeholder="+91-00000-00000"
                className="w-full border-2 p-2 rounded-md"
                value={formattedPhone}
                onChange={handlePhoneChange}
                required
              />
              {errors.contactNumber && (
                <p className="text-red-600 text-sm">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold">
                Email ID <span className="text-red-600">*</span>
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Enter your email"
                className="w-full border-2 p-2 rounded-md"
                value={email}
                onChange={handleEmail}
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">
                Company Name <span className="text-red-600">*</span>
              </label>
              <select
                {...register("companyName", {
                  required: "Company name is required",
                })}
                className="w-full border-2 p-2 rounded-md"
                value={selectedCompany}
                onChange={handleCompanyChange}
              >
                <option value="" disabled>
                  Select a company
                </option>

                {companyList.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>

              {errors.companyName && (
                <p className="text-red-600 text-sm">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="font-semibold">
                Who do you want to meet? <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full border-2 p-2 rounded-md"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                placeholder="Enter the name of the person"
                required
              />
            </div>

            <div>
              <label className="font-semibold">
                Visiting Purpose <span className="text-red-600">*</span>
              </label>
              <input
                {...register("visitingPurpose", {
                  required: "Visiting purpose is required",
                })}
                type="text"
                placeholder="Enter your purpose"
                className="w-full border-2 p-2 rounded-md"
                value={visit}
                onChange={handleVisit}
                required
              />
              {errors.purpose && (
                <p className="text-red-600 text-sm">{errors.purpose.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">
                  Preferred Date <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("date", { required: "Select a date" })}
                  type="date"
                  className="w-full border-2 p-2 rounded-md"
                  value={date}
                  onChange={handleDate}
                  required
                />
                {errors.date && (
                  <p className="text-red-600 text-sm">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">
                  Preferred Time <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("time", { required: "Select a time" })}
                  type="time"
                  className="w-full border-2 p-2 rounded-md"
                  value={time}
                  onChange={handleTime}
                  required
                />
                {errors.time && (
                  <p className="text-red-600 text-sm">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <textarea
                {...register("description")}
                placeholder="Enter your description"
                className="w-full border-2 p-2 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#066882] text-white py-3 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {showPopup && (
        <AppointmentPopup
          formData={tempAppointment}
          onUpdate={handleUpdate}
          onSubmit={handlePopupSubmit}
          mode="preview"
          onGoBackToForm={() => {
            setShowPopup(false);
            setShowForm(true);
          }}
          companyList={companyList}
          initialCompany={tempAppointment ? tempAppointment.companyName : ""}
          initialEmployee={tempAppointment ? tempAppointment.personToMeet : ""}
          appointments={appointments}
        />
      )}
    </div>
  );
};

export default AppointmentForm;
