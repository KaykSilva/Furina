const Api = require('../api');
const axios = require('axios');

const updateBanner = async (userId, imageUrl) => {
    jsonForm = {
        userId: userId,
        imageUrl: imageUrl
    }

    try {
        const response = await Api.put(`user/banner`, jsonForm);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status; // Códigos de status da resposta
            return statusCode
        } else {
            console.error('Erro inesperado:', error);
            throw new Error('Erro inesperado');
        }
    }
}

module.exports = updateBanner;