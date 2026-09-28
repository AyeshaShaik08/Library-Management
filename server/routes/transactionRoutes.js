const express = require("express");
const {
  issueBook,
  returnBook,
  getAllTransactions,
  getDashboardStats,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/stats", getDashboardStats);
router.post("/issue", issueBook);
router.put("/:id/return", returnBook);

module.exports = router;
