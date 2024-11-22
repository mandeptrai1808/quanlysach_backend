const { Schema, model } = require("mongoose");

const NHAXUATBAN = new Schema(
	{
		MANXB: {
			type: String,
			required: true,
			unique: true,
		},
		TENNXB: {
			type: String,
			required: true,
		},
        DIACHI: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("NHAXUATBAN", NHAXUATBAN);