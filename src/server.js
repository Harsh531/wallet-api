import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});

const PORT = process.env.PORT || 5001;


app.get("/", (req, res) => {
    res.send("Welcome to the Transactions API");
});

app.use("/api/transactions", transactionRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
});

