const { Schema, model, Types } = require("mongoose");

const SACH = new Schema(
	{
		TENSACH: {
			type: String,
			required: true,
		},
		THELOAI: {
			type: Types.ObjectId,
			required: true,
			ref: "THELOAI",
		},
        DONGIA: {
			type: Number,
			required: true,
		},
		SOQUYEN: {
			type: Number,
			required: true,
		},
		NAMXUATBAN: {
			type: Number,
			required: true,
		},
		NHAXUATBAN: {
			type: Types.ObjectId,
			required: true,
			ref: "NHAXUATBAN"
		},
		TACGIA: {
			type: String,
			required: true,
		},
		MOTA: {
			type: String,
			require: true,
		},
		HINHANH: {
			type: String,
			require: true,
		}
	},
	{ timestamps: true }
);

module.exports = model("SACH", SACH);