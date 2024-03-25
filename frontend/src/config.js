import axios from "axios";

// api config
const config = {
  apiUrl:
    "http://mla-fitness-app-v7.mla-fitness-app-v7:8080" ||
    process.env.REACT_APP_API_GATEWAY_URL ||
    "http://127.0.0.1:80",
};
export default config;

// track exercise
function getUrl() {
  return config.apiUrl;
}

const baseURL = getUrl();
const api = axios.create({ baseURL });
export const trackExercise = (payload) => api.post(`/exercises/add`, payload);
