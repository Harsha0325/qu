import { TbEdit } from "react-icons/tb";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import Api from "../../api";
import { IoClose } from "react-icons/io5";
import ReferralCodeForm from "./ReferralCodeForm"; // Import the form

const ReferralUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10); 
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [updateData, setUpdateData] = useState({
    endDate: "",
    isActive: true,
    discountPercentage: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [page]); 

  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await Api.get(
        `/referral/with-referral-codes?page=${page}&size=${size}`
      );
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const toggleRow = (userId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const openModal = (referral) => {
    setSelectedReferral(referral);
    setUpdateData({
      endDate: referral.endDate ? referral.endDate.split("T")[0] : "",
      isActive: referral.isActive,
      discountPercentage: referral.discountPercentage,
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const formattedEndDate = updateData.endDate
        ? new Date(updateData.endDate).toISOString().slice(0, 19)
        : null;

      const payload = {
        endDate: formattedEndDate,
        isActive: updateData.isActive,
        discountPercentage: updateData.discountPercentage,
      };

      await Api.put(`/referral/${selectedReferral.id}`, payload);
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating referral code:", error);
    }
  };

  return (
    <div className={`pt-4 mt-4 ${isMobile ? '' : 'ml-[240px]'} font-inter`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users with Referral Codes</h2>
        <button
          className="bg-[#066882] text-white px-4 py-2 rounded hover:bg-[#066882] transition"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Referral Code
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-white">
                <th className="border p-2">SR NO</th>
                <th className="border p-2">Full Name</th>
                <th className="border p-2">User QCard ID</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <React.Fragment key={user.id}>
                  <tr className="bg-white hover:bg-gray-50 transition">
                    <td className="border p-2 text-center">
                      {page * size + index + 1}
                    </td>
                    <td className="border p-2">{user.fullName}</td>
                    <td className="border p-2">{user.userQCardId}</td>
                    <td className="border p-2">{user.email[0]}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => toggleRow(user.id)}
                        className="text-black px-3 py-1 rounded text-sm transition border border-[#ccc]"
                      >
                        {expandedRows[user.id] ? (
                          <AiOutlineMinus />
                        ) : (
                          <AiOutlinePlus />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[user.id] && (
                    <tr>
                      <td colSpan="5" className="border p-2 bg-gray-50">
                        <h3 className="font-semibold mb-2">Referral Codes</h3>
                        {user.referralCodes.length > 0 ? (
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-white">
                                <th className="border p-2">Code</th>
                                <th className="border p-2">Discount (%)</th>
                                <th className="border p-2">Start Date</th>
                                <th className="border p-2">End Date</th>
                                <th className="border p-2">Active</th>
                                <th className="border p-2">Update</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.referralCodes.map((ref) => (
                                <tr
                                  key={ref.id}
                                  className="text-center bg-white"
                                >
                                  <td className="border p-2">{ref.code}</td>
                                  <td className="border p-2">
                                    {ref.discountPercentage}
                                  </td>
                                  <td className="border p-2">
                                    {new Date(
                                      ref.startDate
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="border p-2">
                                    {ref.endDate
                                      ? new Date(
                                          ref.endDate
                                        ).toLocaleDateString()
                                      : "No Expiry"}
                                  </td>
                                  <td className="border p-2">
                                    {ref.isActive ? (
                                      <span className="text-green-600 font-semibold">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="text-red-600 font-semibold">
                                        Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td className="border p-2">
                                    <button
                                      onClick={() => openModal(ref)}
                                      className="bg-white text-black border border-[#ccc] px-2 py-1 rounded"
                                    >
                                      <TbEdit />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500">
                            No referral codes available.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className={`px-4 py-2 rounded ${
                page === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#066882] text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
              className={`px-4 py-2 rounded ${
                page >= totalPages - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#066882] text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <IoClose
              className="absolute top-2 right-2 text-2xl cursor-pointer"
              onClick={() => setModalOpen(false)}
            />
            <h2 className="text-lg font-semibold mb-4">Update Referral Code</h2>
            <label>End Date:</label>
            <input
              type="date"
              value={updateData.endDate}
              onChange={(e) =>
                setUpdateData({ ...updateData, endDate: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />
            <label>Discount (%):</label>
            <input
              type="number"
              value={updateData.discountPercentage}
              onChange={(e) =>
                setUpdateData({
                  ...updateData,
                  discountPercentage: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
            />
            <label>
              <input
                type="checkbox"
                checked={updateData.isActive}
                onChange={(e) =>
                  setUpdateData({ ...updateData, isActive: e.target.checked })
                }
                className="mr-2"
              />{" "}
              Active
            </label>
            <button
              onClick={handleUpdate}
              className="flex bg-[#066882] text-white px-4 py-2 rounded mt-4  items-end"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Modal for Create Referral Code */}
      {createModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <IoClose
              className="absolute top-2 right-2 text-2xl cursor-pointer"
              onClick={() => setCreateModalOpen(false)}
            />
            <ReferralCodeForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralUsersTable;
