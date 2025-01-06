const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

router.get("/:userId", saleController.getUserSale);
router.post("/:userId", saleController.create);
router.put("/", saleController.submitSale);

router.get("/", saleController.getAll);

module.exports = router;
