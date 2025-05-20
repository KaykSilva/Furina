const Api = require('../../api');
const axios = require('axios');

const createUser = async (discordId, userName) => {
    jsonForm = {
        discordId: discordId,
        username: userName,
        balance: 0
    }

    try {
        const response = await Api.post(`user`, jsonForm);
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

module.exports = createUser;