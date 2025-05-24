const Api = require('../../api');
const axios = require('axios');

 const getUserBanner = async (id) => {

    try {
        const response = await Api.get(`user/banner/${id}`);
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

module.exports =  getUserBanner ;