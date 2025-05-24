const Api = require('../../api');
const axios = require('axios');

 const getBanner = async () => {

    try {
        const response = await Api.get(`store`);
        return response.data;
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

module.exports =  getBanner ;