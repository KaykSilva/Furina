const { SlashCommandBuilder } = require('discord.js');

let intervalStarted = false; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Inicia um timer que envia mensagens no canal específico.'),
    async execute(interaction) {
        const channelId = '1216572060344647752';
        const channel = interaction.client.channels.cache.get(channelId);

        if (!channel || !channel.isTextBased()) {
            console.error('Canal não encontrado ou não é um canal de texto.');
            return await interaction.reply('Erro: canal inválido.');
        }

        if (intervalStarted) {
            return await interaction.reply('⏱️ O timer já está rodando!');
        }

        intervalStarted = true;

        await interaction.reply('✅ Timer iniciado! Enviando mensagens a cada 10 segundos.');

        setInterval(() => {
            channel.send(`<@495600222467129344>Migrate, Histórico e Tela de Histórico,`);
        }, 3600000);
    },
};
