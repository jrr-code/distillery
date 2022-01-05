// Lets the user join a game of Artillery
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Players, Games } = require('../Database/Mongoose');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('joingame')
		.setDescription('Join the current artillery game.'),
	async execute(interaction) {
		// fetch the current game.
		try {
			const gameId = await Games
				.findOne({game_status: 'current'})
			if (gameId === 0) {
				return interaction.reply("No games to join. Contact admin");
			} else {
				// There's a game, is the user in it already?
				const userInGame = await Players
					.findOne({
						player_id: interaction.user.id,
						game_id: gameId["id"],
					})
				if (userInGame) {
					return interaction.reply(`Seems you're already in this game.`);
				}

				// Let the player in
				const joinGame = await Players
					.create({
						player_id: interaction.user.id,
						game_id: gameId["_id"]
					})
				return interaction.reply(`You have enlisted into: ${gameId["id"]} :: ${gameId["game_title"]}`);
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
