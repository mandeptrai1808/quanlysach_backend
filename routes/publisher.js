const route = require("express").Router();
const PublisherController = require("../controllers/publisher.controller")

route.route("/").post(PublisherController.createPublisher);
route.route("/").get(PublisherController.getAllPublisher);
route.route("/").put(PublisherController.updatePublisher);
route.route("/:id").delete(PublisherController.deletePublisher);

module.exports = route;