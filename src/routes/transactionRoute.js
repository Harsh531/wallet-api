import express from "express";
import { sql } from "../config/db.js";
import { createTransaction, deleteTransaction, getTransactionByUserId, getSummaryByUserId } from "../controllers/transactionsController.js";

const router = express.Router();


// Get transactions for a specific user
router.get("/:userId", getTransactionByUserId);

// Create transaction
router.post("/", createTransaction);

// Delete transaction
router.delete("/:id", deleteTransaction);

// Get transaction summary for a specific user
router.get("/summary/:userId", getSummaryByUserId);


export default router;