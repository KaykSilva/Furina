const { SlashCommandBuilder, ChannelType } = require('discord.js');

let intervalStarted = false;

const OwnerID = '783914991006253087'; // seu ID aqui

module.exports = {
    data: new SlashCommandBuilder()
        .setName('late-payment')
        .setDescription('Conta quantos dias de atraso após a data de pagamento')
        .setDefaultMemberPermissions(0) // Esconde dos usuários comuns
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

        await interaction.reply(`✅ Contador de atraso iniciado! Enviando alertas em ${channel}.`);

        setInterval(() => {
            const today = new Date().getDate();
            let daysLate = today - paymentDay;

            if (daysLate > 0) {
                channel.send(`<:sad:1270177365074382941> @everyone O pagamento está atrasado há **${daysLate}** dia(s)!`);
            } else {
                channel.send(`✅ Nenhum atraso até agora. Dia de pagamento: ${paymentDay}`);
            }
        }, 86400); // 1 hora
    },
};
