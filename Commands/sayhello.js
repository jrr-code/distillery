const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sayhello')
		.setDescription('Replies with server info!'),
	async execute(interaction) {
		try {
			const tag = await Tags.create({
				name: "hello",
				description: "description",
				username: interaction.user.username,
			});
			return interaction.reply(`Tag ${tag.name} added.`);
		} catch (error) {
			console.log(error);
			return interaction.reply(error.message);
		}
		// await interaction.reply(`:wave: Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};