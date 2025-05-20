const getUser = require("../service/get/user/getUser");

async function dailyVerifier(id) {
    try {
        const response = await getUser(id);
        const redeemAt = response.data.redeemAt;

        if (!redeemAt) return false;

        const lastRedeem = new Date(redeemAt);
        const now = new Date();


        return (
            lastRedeem.getUTCFullYear() === now.getUTCFullYear() &&
            lastRedeem.getUTCMonth() === now.getUTCMonth() &&
            lastRedeem.getUTCDate() === now.getUTCDate()
        );
    } catch (error) {
        console.error("Erro ao verificar daily:", error);
        return false;
    }
}

module.exports = dailyVerifier;
