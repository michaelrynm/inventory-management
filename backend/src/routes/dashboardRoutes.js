const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/summary", dashboardController.getSummary);
router.get("/low-stock", dashboardController.getLowProducts);

module.exports = router;
