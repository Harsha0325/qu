import axios from "axios";

// Create the axios instance
const oauthApi = axios.create({
   baseURL: "/api/quicky_net/oauth",
//  baseURL: "http://localhost:9093/api/quicky_net/oauth",
});

oauthApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Simply return the config (no error handling needed)
});

export default oauthApi;
