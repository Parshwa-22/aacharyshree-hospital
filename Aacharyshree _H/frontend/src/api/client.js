import axios from "axios";

// Point this at your running backend. Set VITE_API_BASE_URL in a .env file
// to override (see .env.example).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // fail fast if the backend isn't reachable, so the public
                 // site can fall back to its default content instead of hanging
});

export default apiClient;
