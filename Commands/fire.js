// A simple fire command
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Players } = require('../Database/Mongoose');
require("survey-toolbox");
const { coordinatesFromBearingDistance } = require('survey-toolbox/lib/CoordsFromBearingDistance');
const { bearingDistanceFromCoordinates } = require('survey-toolbox/lib/BearingDistanceFromCoords')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fire')
		.setDescription('Input bearing (decimal degrees) and distance (metres)')
		.addNumberOption(option => option.setName('decimaldegrees')
			.setDescription("Input decimal degrees to target")
			.setRequired(true))
		.addNumberOption(option => option.setName('metres')
			.setDescription("Input metres to target (metric rulez!)")
			.setRequired(true)),
	async execute(interaction) {
		try {
			// is the user in the game?
			let thisPlayer = await Players
				.count({"player_id": interaction.user.id});
			if (thisPlayer === 0) {
				return interaction.reply("you are not in this game... use /joingame first")
			} else {
				thisPlayer = await Players
					.findOne({
						"player_id": interaction.user.id
					})

				// is the user alive?
				if (thisPlayer["health"] > 0) {
					try {
						// get the users coordinates
						const decDegrees = interaction.options.getNumber('decimaldegrees');
						const metres = interaction.options.getNumber('metres');
						const myVertex = {
							[EASTING]: thisPlayer["easting"],
							[NORTHING]: thisPlayer["northing"],
							[ELEVATION]: thisPlayer["elevation"]
						}

						console.log(myVertex);
						// calculate splash
						const splash = coordinatesFromBearingDistance(myVertex, decDegrees, metres);
						console.log("splash: ", splash);
						// determine result.

						// narrow the query results straight away
						let dbExpr;
						switch (true) {
						case (decDegrees < 90):
							dbExpr = {"easting": { $gte: thisPlayer["easting"] + 1}, "northing": {$gte: thisPlayer["northing"] + 1}};
								break;
						case (decDegrees < 180):
							dbExpr = {"easting": { $gte: thisPlayer["easting"] + 1}, "northing": {$lte: thisPlayer["northing"] - 1}};
							break;
						case (decDegrees < 270):
							dbExpr = {"easting": { $lte: thisPlayer["easting"] - 1}, "northing": {$lte: thisPlayer["northing"] - 1}};
							break;
						default:
							dbExpr = {"easting": { $lte: thisPlayer["easting"] - 1}, "northing": {$gte: thisPlayer["northing"] + 1}};
							break;
						}

						const quadrantPlayers = await Players.find(
							dbExpr
						).select("_id player_id easting northing elevation")

						// Check the splash!
						let hitArray = [];
						let hint;

						for (let playerTarget in quadrantPlayers){
							let targetVertex = {
								[EASTING]: quadrantPlayers[playerTarget]["easting"],
								[NORTHING]: quadrantPlayers[playerTarget]["northing"],
								[ELEVATION]: quadrantPlayers[playerTarget]["elevation"]
							}
							console.log("tgt: ", targetVertex, splash);
							let checkSplash = bearingDistanceFromCoordinates(splash, targetVertex);
							console.log(checkSplash);
							if (checkSplash[DIST_2D] < 500 ) {
								hitArray.push(quadrantPlayers[playerTarget]["player_id"])
							} else {
								hint = `${checkSplash[BEARING]}, ${checkSplash[DIST_2D]}`;
							}
						}

						return interaction.reply({
							content: `Your round landed at ${Math.round(splash[EASTING])}, ${Math.round(splash[NORTHING])}, ${Math.round(splash[ELEVATION])} and you hit ${hitArray.length} targets.` + "```guncomp " + hint + "```"
						});

					} catch (error) {
						return interaction.reply({
							content: "Please ping @JayArghArgh#9867 with this error" +
								"```" + error.message + "```",
							ephemeral: true
						});
					}

				} else {
					return interaction.reply("you're :dizzy_face: even! There's no respawn yet sorry :sad:")
				}
			}
		} catch (error) {
			return interaction.reply({
				content: "Please ping @JayArghArgh#9867 with this error" +
					"```" + error.message + "```",
				ephemeral: true
			});
		}
	}
}