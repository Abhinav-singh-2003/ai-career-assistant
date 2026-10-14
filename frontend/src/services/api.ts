import axios from "axios";
const api = axios.create({
    baseURL:"https://ai-career-assistant12.netlify.app/api"

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