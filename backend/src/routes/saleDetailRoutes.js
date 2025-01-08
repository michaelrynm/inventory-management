const express = require("express");
const router = express.Router();
const saleDetailController = require("../controllers/saleDetailController");

router.get("/:saleId", saleDetailController.getSaleDetail);
router.post("/", saleDetailController.addProduct);
router.delete("/:id", saleDetailController.deleteSaleDetail);

module.exports = router;
