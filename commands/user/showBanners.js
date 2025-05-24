const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const getUserBanner = require("../../service/get/banner/getUserBanner");
const updateBanner = require("../../service/update/updateBanner");

module.exports = async function showBanners(interaction) {
    const userId = interaction.user.id;
    const userData = await getUserBanner(userId);
    const banners = userData.data || [];

    if (banners.length === 0) {
        return await interaction.reply({
            content: "Você ainda não possui banners.",
            ephemeral: true,
        });
    }

    let currentIndex = 0;

    const getBannerEmbed = (index) =>
        new EmbedBuilder()
            .setTitle(`Banner ${banners[index].name}`)
            .setDescription(`${index + 1} de ${banners.length}`)
            .setImage(banners[index].imageUrl)
            .setColor("#0099ff")
            .setFooter({ text: "Use os botões abaixo para navegar ou selecionar." });

    const getButtons = (index) =>
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("prev_banner")
                .setLabel("◀️ Anterior")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(index === 0),

            new ButtonBuilder()
                .setCustomId("select_banner")
                .setLabel("✅ Selecionar")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("next_banner")
                .setLabel("Próximo ▶️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(index === banners.length - 1)
        );

    const message = await interaction.reply({
        embeds: [getBannerEmbed(currentIndex)],
        components: [getButtons(currentIndex)],
        ephemeral: true,
        fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
        time: 60000,
    });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
            return await i.reply({
                content: "Esses botões não são para você.",
                ephemeral: true,
            });
        }

        if (i.customId === "prev_banner") {
            currentIndex--;
        } else if (i.customId === "next_banner") {
            currentIndex++;
        } else if (i.customId === "select_banner") {
            const selectedBanner = banners[currentIndex].imageUrl;

            try {
                await updateBanner(userId, selectedBanner);

                await i.update({
                    content: `✅ Banner #${currentIndex + 1} selecionado com sucesso!`,
                    embeds: [],
                    components: [],
                });
                collector.stop();
                return;
            } catch (error) {
                console.error(error);
                await i.update({
                    content: `❌ Ocorreu um erro ao selecionar o banner.`,
                    components: [],
                });
                collector.stop();
                return;
            }
        }

        await i.update({
            embeds: [getBannerEmbed(currentIndex)],
            components: [getButtons(currentIndex)],
        });
    });

    collector.on("end", async () => {
        try {
            await message.edit({
                components: [],
            });
        } catch (err) {
            console.error("Erro ao remover componentes após timeout:", err);
        }
    });
};
