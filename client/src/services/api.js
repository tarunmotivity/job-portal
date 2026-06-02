import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true, // IMPORTANT
});


API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

// 🔄 Refresh logic
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const user = JSON.parse(localStorage.getItem("user"));

        const updatedUser = {
          ...user,
          token: data.token,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        error.config.headers.Authorization = `Bearer ${data.token}`;

        return API(error.config);
      } catch (err) {
        console.error("Refresh failed:", err);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;