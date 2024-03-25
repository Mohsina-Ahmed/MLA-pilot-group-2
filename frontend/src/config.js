import axios from "axios";

// api config
const config = {
  apiUrl: process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080",
};
export default config;

// track exercise
function getUrl() {
  return config.apiUrl;
}

const baseURL = getUrl();
const api = axios.create({ baseURL });
export const trackExercise = (payload) => api.post(`/exercises/add`, payload);
