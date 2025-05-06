import axios from "axios";

const instance = axios.create({
//  baseURL: "/api/quicky_net",
  //   baseURL: "http://localhost:9093/api/quicky_net",
  baseURL: "http://192.168.30.101:9094/api/quicky_net",

});

export default instance;
