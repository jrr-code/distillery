const { SlashCommandBuilder } = require('@discordjs/builders');
global.EASTING = "e";
global.NORTHING = "n";
global.ELEVATION = "el";
global.BEARING = "bg";
global.DIST_2D = "dist_2d";
global.DIST_3D = "dist_3d";


require("survey-toolbox");
const { NewSurveyPoint } = require('survey-toolbox/lib/SurveyPoint');
const {surveyConfig} = require('survey-toolbox/index');
const { bearingDistanceFromCoordinates } = require('survey-toolbox/lib/BearingDistanceFromCoords');
const { formatAsDms } = require('survey-toolbox/lib/FormatDegMinSec');
let player1 = new NewSurveyPoint("justin");
let player2 = new NewSurveyPoint("cathy");

player1.setVertex({ [EASTING]: 123, [NORTHING]: 123, [ELEVATION]: 456 })
console.log(player1);

player2.setVertex({ [EASTING]: 456, [NORTHING]: 789, [ELEVATION]: 456 })
console.log(player2);

let bdc = bearingDistanceFromCoordinates(player1.getVertex, player2.getVertex);
let bgFormatted = formatAsDms(bdc[BEARING]);
console.log(bdc);

// newPoint = new surveyToolbox.NewSurveyPoint();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Start a new game of Artillery with a friend!'),
	async execute(interaction) {
		await interaction.reply(`:wave: Server name: ${interaction.guild.name}
		Bearing: ${bdc[BEARING]}
		Formatted Bearing: ${bgFormatted}
		Distance (2D): ${bdc[DIST_2D]}`);
		console.log(game);
	},
};