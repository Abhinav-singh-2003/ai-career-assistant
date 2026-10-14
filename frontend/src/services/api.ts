import axios from "axios";
const api =axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"

});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    } else {
        config.headers.delete("Authorization");
    }

    return config;
});

export default api;
// This code creates an Axios instance with a base URL for making API requests. The base URL is determined by the environment variable VITE_API_URL, and if it's not set, it defaults to "http://localhost:5000/api". The instance is then exported for use in other parts of the application.