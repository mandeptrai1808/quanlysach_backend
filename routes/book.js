const route = require("express").Router();
const bookController = require("../controllers/book.controller");
const BookController = require("../controllers/book.controller")

route.route("/").post(BookController.createBook);
route.route("/").get(BookController.listAllBooks);
// route.route("/id/:id").get(BookController.getBookInfor).patch(bookController.updateBook)
route.route("/:id").put(bookController.updateBook)
route.route("/:type").get(BookController.find);
route.route("/:id").delete(bookController.deleteBook)
// route.route("/findbookbyauthor").get(SachController.findBooksByAuthor);
// route.route("/findbookbycategory").get(SachController.findBooksByCategory);
// route.route("/deletebook/:id").delete(SachController.deleteBook);
// route.route("/updatebook/:id").put(SachController.updateBook);

module.exports = route;