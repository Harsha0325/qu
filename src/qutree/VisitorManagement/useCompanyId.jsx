import { useEffect, useState, useContext } from "react";
import Api from "../api";
import { RolesContext } from "../../context/RoleContext";

const useCompanyId = () => {
  const { userId } = useContext(RolesContext);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await Api.get(`/user/${userId}/company-id`);
        setCompanyId(response.data.companyId);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred.");
        console.error("Error fetching company ID:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, [userId]);

  return { companyId, loading, error, userId };
};

export default useCompanyId;
