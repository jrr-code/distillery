const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showstats')
		.setDescription('Replies with server info!'),
	async execute(interaction) {
		await interaction.reply(`:wave: Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};