const { SlashCommandBuilder } = require('@discordjs/builders');
require("survey-toolbox");

global.EASTING = "e";
global.NORTHING = "n";
global.ELEVATION = "el";
global.BEARING = "bg";
global.DIST_2D = "dist_2d";
global.DIST_3D = "dist_3d";

const { NewSurveyPoint } = require('survey-toolbox/lib/SurveyPoint');
const { toDegreesMinutesSeconds } = require('survey-toolbox/lib/ConvertToDegMinSec');
const { formatAsDms } = require('survey-toolbox/lib/FormatDegMinSec');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('todms')
		.setDescription('convert to dms')
		.addStringOption(option => option.setName('decimaldegrees')
			.setDescription("input decimal degrees")
			.setRequired(true)),
	async execute(interaction) {
		try{
			let toDms = interaction.options.getString('decimaldegrees');
			toDms = toDegreesMinutesSeconds(parseFloat(toDms));
			await interaction.reply(formatAsDms(toDms));
		} catch (err) {
			console.log(err);
		}

	},
};