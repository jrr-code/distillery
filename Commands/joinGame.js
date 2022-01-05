// Lets the user join a game of Artillery
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Players, Games } = require('../Database/Mongoose');

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joingame')
		.setDescription('Join the current artillery game.'),
	async execute(interaction) {
		// fetch the current game.
		try {
			let gameId = await Games
				.count({game_status: 'current'})
			if (gameId === 0) {
				return interaction.reply("No games to join. Contact admin");
			} else {
				gameId = await Games.findOne({game_status: 'current'});
				// There's a game, is the user in it already?
				const userInGame = await Players
					.findOne({
						player_id: interaction.user.id,
						game_id: gameId["id"],
					})
				if (userInGame) {
					return interaction.reply({
						content: `Seems you're already in this game.`,
						ephemeral: true,
				});
				}

				// Let the player in
				const gameBoundary = gameId["game_boundary"];
				const easting = randomNumber(gameId["min_e"], gameId["max_e"]);
				const northing = randomNumber(gameId["min_n"], gameId["max_n"]);
				const elevation = randomNumber(gameId["min_el"], gameId["max_el"]);
				let heading = northing > gameBoundary ? randomNumber(90, 270) : randomNumber(0, 180) - 90;
				heading = heading < 0.00 ? heading + 360 : heading;
				const channel = northing > gameBoundary ? "Blue" : "Red"

				const joinGame = await Players
					.create({
						"player_id": interaction.user.id,
						"game_id": gameId["_id"],
						"easting": easting,
						"northing": northing,
						"elevation": elevation,
						"heading": heading,
						"channel": channel
					})

				// Assign a role for channel comms
				// let role = interaction.guild.roles.cache.find(role => role.name === channel);
				// interaction.member.roles.add(role);

				// success message
				return interaction.reply(`${interaction.user.username} has enlisted into the ${channel} team: ${gameId["id"]} :: ${gameId["game_title"]}`);

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
