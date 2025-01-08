const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
const { checkRole } = require("../middleware/authMiddleware");

router.get("/user/:id", saleController.getUserSale);
router.post("/", saleController.create);
router.put("/", saleController.submitSale);
router.delete("/:id", saleController.deleteSale);

router.get("/admin", saleController.getAll);

module.exports = router;
