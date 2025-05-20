const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const redeemCode = require('../../service/post/redeem/redeemCode');
const verifyUser = require('../../util/userVerifyer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redeem')
    .setDescription('Resgate um código de recompensa')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('Insira o código de recompensa')
        .setRequired(true)
    ),

  async execute(interaction) {
    const discordId = interaction.user.id;
    const hasUser = await verifyUser(discordId);

    if (!hasUser) {
      return await interaction.reply({
        content: '<:ryo2:1269695982963003492> Você é novo por aqui? antes de usar qualquer comando, por favor, use o `/daily`',
        ephemeral: true,
      });
    }

    const code = interaction.options.getString('code');

    if (!code) {
      return await interaction.reply({
        content: '❌ Insira algum código de recompensa',
        ephemeral: true,
      });
    }

    try {
      const response = await redeemCode(code, discordId);
      const { result } = response;

      const embed = new EmbedBuilder()
        .setTitle('🎉 Código resgatado com sucesso!')
        .setColor(0x00AE86)
        .setImage('https://i.pinimg.com/originals/50/f5/bc/50f5bcbc82b3bc1fca33df1a1e270a58.gif')
        .addFields(
          { name: '📦 Código', value: result.code, inline: true },
          { name: '<:ryocoins:1271500356613832794> Recompensa', value: `${result.amount} ryocoins`, inline: true },
          { name: '🕓 Criado em', value: `<t:${Math.floor(new Date(result.createdAt).getTime() / 1000)}:f>`, inline: true },
          { name: '📅 Expira em', value: result.expiresAt ? `<t:${Math.floor(new Date(result.expiresAt).getTime() / 1000)}:f>` : 'Sem validade', inline: true },
        )
        .setFooter({ text: '<:ryo:1269693780194496542> Ryo!' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      await interaction.reply({
        content: '❌ Código inválido, já utilizado ou expirado.',
        ephemeral: true,
      });
    }
  },
};
