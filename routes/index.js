const route = require("express").Router();

route.use("/api/librarian", require("./librarian"));
route.use("/api/member", require("./member"));
route.use("/api/book", require("./book"));
route.use("/api/publisher", require("./publisher"));
route.use("/api/category", require("./category"));
route.use("/api/loanrecord", require("./loanrecord"));

module.exports = route;
