const route = require("express").Router();
const LoanRecordController = require("../controllers/loanrecord.controller")

route.route("/").post(LoanRecordController.loanBook)
route.route("/:id").get(LoanRecordController.getLoanRecordById)
route.route("/").get(LoanRecordController.getAllLoanRecord)
route.route("/").put(LoanRecordController.updateStatusLoanRecord)

module.exports = route