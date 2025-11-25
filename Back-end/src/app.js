import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import histoireRoutes from "./routes/histoireRoutes.js";

dotenv.config();

const app = express();

// ==== CORS + COOKIES ====
app.use(cors({
    origin: "http://localhost:3000",  // ton front
    credentials: true                 // autorise l'envoi de cookies
}));

// Body parser
app.use(express.json());

// ==== SESSION ====
app.use(session({
    secret: "super_secret_key_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,   // true seulement si HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 jour
    }
}));

// Connexion DB
connectDB();

// Test route
app.get("/api/ping", (req, res) => {
    res.json({ message: "API opérationnelle !" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/histoires", histoireRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
