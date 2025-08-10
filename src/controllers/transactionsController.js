import { sql } from "../config/db.js";

// Get transactions for a specific user
export const getTransactionByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const transaction = await sql`
           SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        res.status(200).json(transaction);

    } catch (error) {
        console.log("Error getting the transactions", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Create transaction
export const createTransaction = async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;

        if (!title || !user_id || !amount || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `;

        res.status(201).json(transaction[0]);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}

// Delete transaction
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;


        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction ID" })
        }

        const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.log("Error deleting transaction", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

// Get transaction summary for a specific user
export const getSummaryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
         SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
                 SELECT COALESCE(SUM(amount), 0) as income FROM transactions 
                 WHERE user_id = ${userId} AND amount > 0
        `;

        const expensesResult = await sql`
                 SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions 
                 WHERE user_id = ${userId} AND amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        })

    } catch (error) {
        console.log("Error getting the summary", error);
        res.status(500).json({ message: "Internal server error" });
    }
}