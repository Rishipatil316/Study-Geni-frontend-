import axios from "axios";

const API = axios.create({
  baseURL: "https://edu-mentor-backend.vercel.app/api",
});

export default API;