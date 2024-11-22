const { Schema, model } = require("mongoose");

const DOCGIA = new Schema(
	{
		MADOCGIA: {
			type: String,
			required: true,
			unique: true,
		},
		MATKHAU: {
			type: String,
			required: true,
		},
		HOLOT: {
			type: String,
			required: true,
		},
		TEN: {
			type: String,
			required: true,
		},
		NGAYSINH: {
			type: Date,
			required: true,
		},
        PHAI: {
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

module.exports = model("DOCGIA", DOCGIA);