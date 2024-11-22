const route = require("express").Router();
const LibrarianController = require("../controllers/librarian.controller")
const auth = require("../middleware/auth.middleware")

route.route("/").post(LibrarianController.login);
route.route("/").get(auth.authLibrarian, LibrarianController.auth);

module.exports = route;