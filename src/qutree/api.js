import axios from "axios";

const instance = axios.create({
  //  baseURL: "/api/quicky_net",
  baseURL: "http://192.168.30.101:9094/api/quicky_net",

  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default instance;

