const mongoose = require("mongoose");
const { Games } = require('../Mongoose');
// Stores the game players.

module.exports = mongoose("Player", new mongoose.Schema({
	easting: {
		type: Number,
	},
	northing: {
		type: Number,
	},
	elevation: {
		type: Number,
	},
	heading: {
		type: Number,
	},
	health: {
		type: Number,
		default: 100,
	},
	channel: {
		type: String,
	},
	player_class: {
		type: String,
	},
	game_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Games,
	}
}
));
