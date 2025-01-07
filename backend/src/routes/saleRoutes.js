const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
const { checkRole } = require("../middleware/authMiddleware");

router.get("/:id", saleController.getUserSale);
router.post("/", saleController.create);
router.put("/", saleController.submitSale);
router.delete("/:id", saleController.deleteSale);

// router.get("/admintransactions", saleController.getAll);

module.exports = router;
