// api.js
require('dotenv').config(); // Certifique-se de carregar as variáveis .env
const axios = require('axios');

const url = `${process.env.API_URL}/api/`;

const Api = axios.create({
    baseURL: url,
    withCredentials: true,
});

Api.interceptors.request.use(
    (config) => {
        const token = process.env.JWT;

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        console.log("HEADERS FINAL:", config.headers);

        return config;
    },
    (error) => Promise.reject(error)
);

module.exports = Api;
