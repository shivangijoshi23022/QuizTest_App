// import axios from 'axios';

// const axiosInstance = axios.create({
//     headers: {
//          Authorization : `Bearer ${localStorage.getItem('token')}`
//     }
// });

// export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://quiz-app-one-tau.vercel.app/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to add the token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.error("Error in request:", error);
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor to handle responses globally
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Error in response:", error);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://quiz-app-one-tau.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error in request:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error in response:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

