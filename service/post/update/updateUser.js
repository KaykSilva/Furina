const Api = require('../../api');
const axios = require('axios');

const updateUser = async (discordId, reward) => {
    jsonForm = {
        discordId: discordId,
        value: reward
    }

    try {
        const response = await Api.post(`redeem/daily`, jsonForm);
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

module.exports = updateUser;