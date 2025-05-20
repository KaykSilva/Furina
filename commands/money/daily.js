const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const verifyUser = require('../../util/userVerifyer');
const createUser = require('../../service/post/user/createUser');
const updateUser = require('../../service/post/update/updateUser');
const dailyVerifier = require('../../util/dailyVerifier');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Resgate sua recompensa diária'),

    async execute(interaction) {
        const discordId = interaction.user.id;
        const userName = interaction.user.username;
        const hasUser = await verifyUser(discordId);

        if (!hasUser) {
            try {
                await createUser(discordId, userName);
                return await interaction.reply({
                    content: '<:ryo2:1269695982963003492> Sua carteira foi criada! Use o comando `/daily` para resgatar recompensas diárias.',
                    ephemeral: true,
                });
            } catch (error) {
                return await interaction.reply({
                    content: '<:ryo2:1269695982963003492> Não foi possível criar sua carteira! Tente novamente.',
                    ephemeral: true,
                });
            }
        }

        const hasRedeemed = await dailyVerifier(discordId);

        if (hasRedeemed) {
            return interaction.reply({
                content: "<:sad:1270177365074382941> Você já resgatou sua recompensa diária hoje. Volte amanhã!",
                ephemeral: true,
            });
        }

        const reward = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;

        try {
            await updateUser(discordId, reward);

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('<:ryocoins:1271500356613832794> Recompensa Diária!')
                .setDescription(`Você recebeu **${reward.toLocaleString()}** ryocoins!`)
                .setFooter({ text: 'Volte amanhã para mais recompensas!' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            await interaction.reply({
                content: '❌ Ocorreu um erro ao resgatar sua recompensa. Tente novamente mais tarde.',
                ephemeral: true,
            });
        }
    },
};
