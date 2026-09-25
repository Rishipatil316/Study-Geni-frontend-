import axios from "axios";

const API = axios.create({
  baseURL: "https://edu-mentor-backend.vercel.app/api",
  // baseURL: "http://localhost:3000/api",
});

export default API;