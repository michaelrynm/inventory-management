const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expesesController.js");

router.post("/", expenseController.createExpense);
router.put("/:id", expenseController.updateExpense);
router.get("/", expenseController.getAllExpenses);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
