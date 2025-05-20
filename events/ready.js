const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`✅ Bot online como ${client.user.tag}`);

		const statuses = [
			'💭 /daily para resgatar sua recompensa diária',
			'💡 /redeem para resgatar códigos de presente',
			'📋 organizando comandos',
			'🤖 pronto para ajudar!',
			'🏪 nova loja chegando!',
		];

		let index = 0;

		const updateStatus = () => {
			const statusText = statuses[index];

			client.user.setPresence({
				status: 'online',
				activities: [
					{	name: 'ryobot',
						type: ActivityType.Custom,
						state: statusText,
					},
				],
			});

			index = (index + 1) % statuses.length; // reinicia o ciclo quando chega no fim
		};

		// Atualiza o status imediatamente
		updateStatus();

		// Depois a cada 30 segundos
		setInterval(updateStatus, 30 * 1000); // 30 segundos
	},
};
