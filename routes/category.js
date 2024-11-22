const route = require("express").Router();
const CategoryController = require("../controllers/category.controller")

route.route("/").post(CategoryController.createCategory);
route.route("/").get(CategoryController.getAllCategory);
route.route("/").put(CategoryController.updateCategory);
route.route("/:id").delete(CategoryController.deleteCategory);

module.exports = route;