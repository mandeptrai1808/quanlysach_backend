const { Schema, model } = require("mongoose");

const NHANVIEN = new Schema(
	{
		MSNV: {
			type: String,
			required: true,
			unique: true,
		},
		HOTENNV: {
			type: String,
			required: true,
		},
		MATKHAU: {
			type: String,
			required: true,
		},
		CHUCVU: {
			type: String,
			required: true,
		},
        DIACHI: {
			type: String,
			required: true,
		},
        SODIENTHOAI: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("NHANVIEN", NHANVIEN);