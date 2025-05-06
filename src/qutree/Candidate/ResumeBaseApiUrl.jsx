import axios from "axios";

const instance = axios.create({
  baseURL: "/api/e2e",
  //   baseURL: "http://localhost:9092/api/e2e",
});

export default instance;
