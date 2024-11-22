const { Schema, model, Types } = require("mongoose");

const THEODOIMUONSACH = new Schema(
	{
		DOCGIA: {
			type: Types.ObjectId,
			required: true,
			ref: "DOCGIA",
		},
        SACH: {
			type: Types.ObjectId,
			required: true,
			ref: "SACH",
		},
		NGAYMUON: {
			type: Date,
			required: true,
		},
		NGAYTRA: {
			type: Date,
			required: true,
		},
		TRANGTHAI: {
			type: Number,
			required: true,
			default: 0,
		}
	},
	{ timestamps: true }
);

const theodoimuonsach = model("THEODOIMUONSACH", THEODOIMUONSACH);
theodoimuonsach.createIndexes({DOCGIA: true, MASACH: true, NGAYMUON: true}, {unique: true});
module.exports = theodoimuonsach;