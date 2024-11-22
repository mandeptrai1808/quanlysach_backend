const express = require("express");
const cors = require("cors");
const route = require("./routes")
const multer = require("multer")
const path = require("path");
const uploadsDir = path.resolve(__dirname, "./uploads");

const upload = multer({ dest: uploadsDir });

const app = express();

app.use(cors());
app.use(express.json())
app.use(route)
app.use("/statics", express.static(uploadsDir));


app.post("/api/upload", upload.single("file"), (req, res) => {
	const file = req.file;
	if (!file) return res.status(400).send("Please upload a file");
	return res.json({filename: file.filename})
})

app.get("/", (req, res) =>{
    res.json({message: "Welcome to library management application."})
});


const errorHandler = (error, req, res, next) => {
	res.status(error.status || 500).send({ message: error.message });
	next();
};

app.use(errorHandler);

module.exports = app;