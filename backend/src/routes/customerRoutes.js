const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");

router.get("/", customerController.getAll);
router.get("/:id", customerController.getDetail);
router.post("/", customerController.create);
router.put("/:id", customerController.update);
router.delete("/:id", customerController.delete);

module.exports = router;
