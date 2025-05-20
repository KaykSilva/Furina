const Api = require('../../api');
const axios = require('axios');

 const getUser = async (id) => {

    try {
        const response = await Api.get(`user/${id}`);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status; 
            return statusCode
        } else {
            console.error('Erro inesperado:', error);
            throw new Error('Erro inesperado');
        }
    }
}

module.exports =  getUser ;