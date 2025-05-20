const getUser = require("../service/get/user/getUser");

async function userVerifyer(id) {
    try {
        const response = await getUser(id);
        if (response.status === 404) {
            return false
        }
       return response
    } catch (error) {
        console.error(error);
    }
}

module.exports = userVerifyer