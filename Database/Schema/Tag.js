const mongoose = require("mongoose");

module.exports = mongoose.model("Tags", new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	description: {
		type: String
	},
	username: {
		type: String,
	},
	usage_count: {
		type: Number,
		get: v => Math.round(v),
		set: v => Math.round(v),
		default: 0,
		required: true
	}
}))