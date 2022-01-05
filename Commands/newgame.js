// Creates a new game (admin only - specifically, JRR)
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Games } = require('../Database/Mongoose');
const admin_mode = false


module.exports = {
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Creates a new Artillery game.'),
	async execute(interaction) {
		try {
			if (admin_mode === true) {
				try {
					const game = await Games.create({
						game_title: "test game by JRR"
					});
					return interaction.reply("Game created");
				} catch (error) {
					console.log(error);
				}
			} else {
				return interaction.reply({
					content: `:no_entry: sorry ${interaction.user.username} that function is not supported yet.`,
					ephemeral: true
				});
			}
		} catch (error) {
			return interaction.reply({
				content: "Please ping @JayArghArgh#9867 with this error" +
					"```" + error.message + "```",
				ephemeral: true
			});
		}
	},
};
