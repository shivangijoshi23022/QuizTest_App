// const { default: axiosInstance } = require(".");

// export const registerUser = async (payload) => {
//     try {
//         const response = await axiosInstance.post('/api/users/register', payload);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// export const loginUser = async (payload) => {
//     try {
//         const response = await axiosInstance.post('/api/users/login', payload);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// export const getUserInfo = async () => {
//     try {
//         const response = await axiosInstance.post('/api/users/get-user-info');
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }




import axiosInstance from './index';  // Adjust the path according to your folder structure

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        return error.response.data; // Handle error response
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('https://quiz-app-frontend-drab.vercel.app/login', payload);
        return response.data;
    } catch (error) {
        return error.response.data; // Handle error response
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data; // Handle error response
    }
}

