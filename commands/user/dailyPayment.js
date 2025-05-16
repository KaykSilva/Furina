const { SlashCommandBuilder, ChannelType } = require('discord.js');

let intervalStarted = false;

const OwnerID = '783914991006253087'; // coloque o seu ID aqui

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-payment')
        .setDescription('Conta os dias restantes para o pagamento')
        .setDefaultMemberPermissions(0) // Oculta o comando de usuários comuns
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal onde as mensagens serão enviadas')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption(option =>
            option.setName('payment-day')
                .setDescription('Dia do pagamento (1 a 31)')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (interaction.user.id !== OwnerID) {
            return await interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true,
            });
        }

        const channel = interaction.options.getChannel('canal');
        const paymentDay = interaction.options.getInteger('payment-day');

        if (intervalStarted) {
            return await interaction.reply('⏱️ O contador já está rodando!');
        }

        intervalStarted = true;

        await interaction.reply(`✅ Contador iniciado! Mensagens serão enviadas em ${channel} diariamente.`);

        setInterval(() => {
            const today = new Date().getDate();
            let daysRemaining = paymentDay - today;

            if (daysRemaining < 0) {
                const lastDayOfMonth = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                ).getDate();
                daysRemaining = (lastDayOfMonth - today) + paymentDay;
            }

            channel.send(`<:ryo4:1271506831222636625> @everyone Faltam **${daysRemaining}** dia(s) para o pagamento!`);
        }, 86400); // 1 hora
    },
};
