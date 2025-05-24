const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const getBanner = require('../../service/get/store/getBanners');
const verifyUser = require('../../util/userVerifyer');
const getUser = require('../../service/get/user/getUser');
const createUser = require('../../service/post/user/createUser');
const buyBanner = require('../../service/update/store/buyBanner');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('Veja a loja semanal'),

    async execute(interaction) {
        const discordId = interaction.user.id;
        const userName = interaction.user.username;

        try {
            const hasUser = await verifyUser(discordId);
            if (!hasUser) {
                await createUser(discordId, userName);
                return await interaction.reply({
                    content: '👜 Sua carteira foi criada! Use o comando `/daily` para resgatar recompensas diárias.',
                    flags: 64,
                });
            }

            const banners = await getBanner();
            if (!banners.length) {
                return await interaction.reply({
                    content: '🛒 Nenhum banner disponível na loja no momento.',
                    flags: 64,
                });
            }

            let page = 0;

            const generateEmbed = (index) => {
                const banner = banners[index];
                return new EmbedBuilder()
                    .setTitle(`🖼️ Banner: ${banner.name}`)
                    .setDescription(`<:ryocoins:1271500356613832794> Preço: **${banner.price} ryocoins**`/n)
                    .setImage(banner.imageUrl)
                    .setColor(0x00ae86)
                    .setFooter({ text: `Página ${index + 1} de ${banners.length}` });
            };

            const generateRow = (index) => {
                return new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('⬅️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(index === 0),

                    new ButtonBuilder()
                        .setCustomId('buy')
                        .setLabel('🛒 Comprar')
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('➡️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(index === banners.length - 1),
                );
            };

            const message = await interaction.reply({
                embeds: [generateEmbed(page)],
                components: [generateRow(page)],
                fetchReply: 64,
            });

            const collector = message.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (btn) => {
                if (btn.user.id !== interaction.user.id) {
                    return btn.reply({
                        content: '❌ Você não pode interagir com este menu.',
                        ephemeral: 64,
                    });
                }

                switch (btn.customId) {
                    case 'next':
                        page++;
                        break;
                    case 'previous':
                        page--;
                        break;
                    case 'buy': {
                        const banner = banners[page];
                        const user = await getUser(discordId);
                        const ryocoins = user.data.balance;

                        if (ryocoins < banner.price) {
                            return btn.reply({
                                content: `<:sad:1270177365074382941> Você não tem ryocoins suficientes.\n<:ryocoins:1271500356613832794> Saldo: ${ryocoins} ryocoins\n🖼️ Preço: ${banner.price} ryocoins`,
                                flags: 64,
                            });
                        }

                        const response = await buyBanner(banner.price, discordId, banner.imageUrl, banner.name);
                        console.log(response);
                        return btn.reply({
                            content: `✅ Banner **${banner.name}** adquirido com sucesso!\n <:ryocoins:1271500356613832794> ${banner.price} ryocoins foram debitados da sua conta.`,
                            flags: 64,
                        });
                    }
                }

                await btn.update({
                    embeds: [generateEmbed(page)],
                    components: [generateRow(page)],
                });
            });

            collector.on('end', async () => {
                try {
                    await interaction.editReply({ components: [] });
                } catch (_) { }
            });

        } catch (err) {
            console.error('Erro no comando /loja:', err);
            return interaction.reply({
                content: '❌ Ocorreu um erro ao processar a loja.',
                flags: 64,
            });
        }
    },
};
