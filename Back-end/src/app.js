import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // chemin à adapter selon ton arborescence

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
connectDB();

// Route test
app.get("/api/ping", (req, res) => {
  res.json({ message: "API opérationnelle !" });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
