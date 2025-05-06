import React, { useState, useEffect, useContext } from "react";
import Api from "../../api";
import ShareModal from "./SocialShareModal";
import { RolesContext } from "../../../context/RoleContext";

const ReferralCodeTable = () => {
  const [referralCodes, setReferralCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(RolesContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  useEffect(() => {
    if (userId) {
      fetchReferralCodes();
    }
  }, [userId]);

  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const fetchReferralCodes = async () => {
    if (!userId) return; 
    setLoading(true); 
    try {
      const response = await Api.get(`/referral/user/${userId}`);
      setReferralCodes(response.data);
    } catch (error) {
      console.error("Error fetching referral codes");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (code) => {
    setSelectedCode(code);
    setModalOpen(true);
  };

  return (
    <div className={`pt-4 mt-4 ${isMobile ? "" : "ml-[240px]"} font-inter`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Referral Codes</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : referralCodes.length === 0 ? (
        <p className="text-center text-gray-500">No referral codes available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-white">
                <th className="border p-2">ID</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Discount (%)</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Active</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {referralCodes.map((ref) => (
                <tr key={ref.id} className="text-center bg-white">
                  <td className="border p-2">{ref.id}</td>
                  <td className="border p-2">{ref.code}</td>
                  <td className="border p-2">{ref.discountPercentage}</td>
                  <td className="border p-2">
                    {new Date(ref.startDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {ref.endDate
                      ? new Date(ref.endDate).toLocaleDateString()
                      : "No Expiry"}
                  </td>
                  <td className="border p-2">
                    {ref.isActive ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleShare(ref.code)}
                      className="bg-[#066882] text-white px-3 py-1 rounded"
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        referralCode={selectedCode}
      />
    </div>
  );
};

export default ReferralCodeTable;
