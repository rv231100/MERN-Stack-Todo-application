import axios from "axios";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const api = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
