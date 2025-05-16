const { SlashCommandBuilder, ChannelType } = require('discord.js');

let intervalStarted = false;

const phase = [
    '🗨️ Chat!',
    '📄 Histórico!',
    '🚀 Migrate já foi feita?',
    '🛏️ Histórico das cama',
];

const OwnerID = '783914991006253087';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Envia mensagens a cada 1h para uma pessoa específica')
        .setDefaultMemberPermissions(0)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal onde as mensagens serão enviadas')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário que será mencionado')
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
        const user = interaction.options.getUser('usuario');

        if (intervalStarted) {
            return await interaction.reply('⏱️ O timer já está rodando!');
        }

        intervalStarted = true;

        await interaction.reply(`✅ Timer iniciado! Enviando mensagens em ${channel} mencionando ${user} a cada 1h.`);

        setInterval(() => {
            const randomPhase = phase[Math.floor(Math.random() * phase.length)];
            channel.send(`<@${user.id}> ${randomPhase}`);
        }, 3600000); // 1 hora
    },
};
