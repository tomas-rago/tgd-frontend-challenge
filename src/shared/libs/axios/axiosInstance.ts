import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://testback.tgdcompany.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
