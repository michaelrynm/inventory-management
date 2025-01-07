const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
const { checkRole } = require("../middleware/authMiddleware");

router.get("/", saleController.getUserSale);
router.post("/", saleController.create);
router.put("/", saleController.submitSale);

router.get("/admin", checkRole("ADMIN"), saleController.getAll);

module.exports = router;
