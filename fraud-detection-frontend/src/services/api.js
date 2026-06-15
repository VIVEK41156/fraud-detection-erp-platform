import axios from "axios";

const API = axios.create({
  baseURL:
    "http://localhost:5000/api",
});

// Auto attach token
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    console.log(
      "TOKEN:",
      token
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

export default API;