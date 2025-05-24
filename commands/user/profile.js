const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const verifyUser = require("../../util/userVerifyer");
const getUser = require("../../service/get/user/getUser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("🙂 Veja o perfil de alguém ou o seu.")
    .addUserOption(option =>
      option.setName("usuário")
        .setDescription("O usuário para ver o perfil")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    // Pegando o usuário escolhido (ou o autor do comando)
    const target = interaction.options.getUser("usuário") || interaction.user;
    const member = interaction.guild.members.cache.get(target.id);

    const userId = target.id;

    try {
      const hasUser = await verifyUser(userId);
      if (!hasUser) {
        return await interaction.editReply({
          content: `<:ryo2:1269695982963003492> ${target.username} ainda não se registrou. Peça para usar \`/daily\` primeiro.`,
          flags: 64,
        });
      }

      const userData = await getUser(userId);

      const generalColor = "#0f0f0f";
      const badgeAreaColor = "#161616";
      const defaultBanner = "https://i.pinimg.com/originals/54/ad/ed/54aded2832204ae26b6c57ddf7ad4854.gif";
      const bannerImage = userData.data.activeBanner || defaultBanner;
      const badgeImageUrl = "https://risibank.fr/cache/medias/0/31/3143/314349/full.png";

      const canvas = createCanvas(500, 450);
      const context = canvas.getContext("2d");

      const profileImageUrl = target.displayAvatarURL({ extension: "png", size: 512 });
      const avatar = await loadImage(profileImageUrl);
      const banner = await loadImage(bannerImage);
      const badgeImage = await loadImage(badgeImageUrl);

      const bannerWidth = 500;
      const bannerHeight = banner.height * (bannerWidth / banner.width);
      const bannerY = -20;
      context.drawImage(banner, 0, bannerY, bannerWidth, bannerHeight);

      context.save();
      context.strokeStyle = generalColor;
      context.lineWidth = 10;
      context.strokeRect(5, bannerY + 5, bannerWidth - 10, bannerHeight - 10);
      context.restore();

      context.fillStyle = generalColor;
      context.fillRect(0, 170, 500, 300);

      context.fillStyle = badgeAreaColor;
      context.fillRect(380, 180, 100, 30);

      context.drawImage(badgeImage, 390, 180, 35, 30);

      const avatarX = 20;
      const avatarY = 100;
      const maskRadius = 60;
      const borderWidth = 10;
      const totalRadius = maskRadius + borderWidth;

      context.save();
      context.beginPath();
      context.arc(avatarX + totalRadius, avatarY + totalRadius, totalRadius, 0, Math.PI * 2);
      context.fillStyle = generalColor;
      context.fill();
      context.restore();

      context.save();
      context.beginPath();
      context.arc(avatarX + totalRadius, avatarY + totalRadius, maskRadius, 0, Math.PI * 2);
      context.clip();
      context.drawImage(avatar, avatarX + borderWidth, avatarY + borderWidth, maskRadius * 2, maskRadius * 2);
      context.restore();

      const displayName = member?.displayName || target.username;
      const username = target.username;

      context.fillStyle = "white";
      context.font = "bold 30px Nunito";
      context.fillText(displayName, 160, 200);

      context.fillStyle = "rgb(133, 133, 133)";
      context.font = "bold 16px Nunito";
      context.fillText(`@${username}`, 160, 220);

      const balance = userData.data.balance ?? 0;
      const formattedBalance = new Intl.NumberFormat('pt-BR').format(balance);

      const coinImageUrl = "https://cdn-icons-png.flaticon.com/512/138/138281.png";
      const coinImage = await loadImage(coinImageUrl);

      const coinX = 20;
      const coinY = 260;
      const coinSize = 20;
      context.drawImage(coinImage, coinX, coinY, coinSize, coinSize);

      context.fillStyle = "gold";
      context.font = "bold 20px Nunito";
      context.fillText(`${formattedBalance} Ryocoins`, coinX + coinSize + 10, coinY + 17);

      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "profile-image.png" });
      await interaction.editReply({ files: [attachment] });

    } catch (error) {
      console.error("Erro ao gerar a imagem de perfil:", error);
      await interaction.editReply({
        content: "Ocorreu um erro ao gerar o perfil. Tente novamente mais tarde.",
        flags: 64,
      });
    }
  }
};
