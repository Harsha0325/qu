import axios from "axios";

const instance = axios.create({
  baseURL: "/api/payment",
//   baseURL: "http://192.168.30.28:7500/api/payment",
});
export default instance;
