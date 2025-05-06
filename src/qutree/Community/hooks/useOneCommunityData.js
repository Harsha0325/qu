import { useState, useEffect } from "react";
import Api from "../../BaseUrlAPI";
import { useAuth } from "../../../context/AuthContext";

const useCommunityData = (communityId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jwtToken } = useAuth() || {};
  useEffect(() => {
    if (communityId) {
      Api.get(`/get-community-by-id/${communityId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [communityId]);

  return { data, loading, error };
};

export default useCommunityData;
