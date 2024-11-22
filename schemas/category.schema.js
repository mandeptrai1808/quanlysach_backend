const { Schema, model } = require("mongoose");

const THELOAI = new Schema(
	{
		MATHELOAI: {
			type: String,
			required: true,
			unique: true,
		},
		TENTHELOAI: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("THELOAI", THELOAI);