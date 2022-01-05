const mongoose = require("mongoose");
// Sets up the parameters for the game world (ie the map)

module.exports = mongoose.model("Game", new mongoose.Schema({
	game_title: {
		type: String,
		unique: true
	},
	min_e: {
		type: Number,
		default: 10000
	},
	max_e: {
		type: Number,
		default: 20000
	},
	min_n: {
		type: Number,
		default: 10000
	},
	max_n: {
		type: Number,
		default: 20000
	},
	min_el: {
		type: Number,
		default: 300
	},
	max_el: {
		type: Number,
		default: 350
	},
	game_status: {
		type: String,
		default: "paused"
	},
	game_boundary: {
		type: Number,
		default: 15000
	},
}
));
