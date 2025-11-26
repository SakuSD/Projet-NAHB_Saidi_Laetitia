import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { db } from "./config/db.js"; // 👉 connexion MySQL

import authRoutes from "./routes/authRoutes.js";
import histoireRoutes from "./routes/histoireRoutes.js";

// Load .env
dotenv.config();

const app = express();

// ==== CORS ====
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}));

// Body parser
app.use(express.json());

// ==== SESSION ====
app.use(session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true si HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 jour
    }
}));

// ==== TEST MySQL ====
try {
    await db.query("SELECT 1");
    console.log("✅ MySQL connecté avec succès !");
} catch (error) {
    console.error("❌ Erreur MySQL :", error);
}

// Test route
app.get("/api/ping", (req, res) => {
    res.json({ message: "API opérationnelle (MySQL) !" });
});

// ==== ROUTES ====
app.use("/api/auth", authRoutes);
app.use("/api/histoires", histoireRoutes);

// ==== START SERVEUR ====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
