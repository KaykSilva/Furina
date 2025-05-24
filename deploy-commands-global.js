require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] O comando em ${filePath} está faltando "data" ou "execute".`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`⏳ Registrando ${commands.length} comandos...`);
		const globalData = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands }
		);
		console.log(`✅ Comandos registrados globalmente: ${globalData.length}`);
	} catch (error) {
		console.error('❌ Erro ao registrar comandos:', error);
	}
})();
