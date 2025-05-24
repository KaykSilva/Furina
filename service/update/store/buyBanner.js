const Api = require('../../api');
const axios = require('axios');

const buyBanner = async (price, userId, imageUrl, name) => {
    jsonForm = {
        userId: userId,
        imageUrl: imageUrl,
        name: name,
        price: price
    }
    console.log(jsonForm);
    try {
        const response = await Api.put(`store`, jsonForm);
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

module.exports = buyBanner;