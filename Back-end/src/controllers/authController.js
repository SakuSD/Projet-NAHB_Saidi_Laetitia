import bcrypt from "bcrypt";
import { db } from "../config/db.js";

// INSCRIPTION
export const register = async (req, res) => {
    try {
        const { pseudo, email, motDePasse, role } = req.body;

        // Vérifie si email existe
        const [rows] = await db.query(
            "SELECT * FROM utilisateurs WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        // Hash du mot de passe
        const hash = await bcrypt.hash(motDePasse, 10);

        // Insertion en SQL
        const [result] = await db.query(
            "INSERT INTO utilisateurs (pseudo, email, motDePasse, role) VALUES (?, ?, ?, ?)",
            [pseudo, email, hash, role || "lecteur"]
        );

        const newUserId = result.insertId;
        req.session.userId = newUserId;

        res.status(201).json({
            message: "Compte créé.",
            user: {
                id: newUserId,
                pseudo,
                email,
                role: role || "lecteur"
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CONNEXION
export const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM utilisateurs WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Utilisateur introuvable." });
        }

        const user = rows[0];

        const match = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!match) return res.status(400).json({ message: "Mot de passe incorrect." });

        req.session.userId = user.id;

        res.json({
            message: "Connecté.",
            user: {
                pseudo: user.pseudo,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DÉCONNEXION
export const logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Déconnecté." });
};

// INFOS UTILISATEUR CONNECTÉ
export const me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Non connecté." });
        }

        const [rows] = await db.query(
            "SELECT id, pseudo, email, role FROM utilisateurs WHERE id = ?",
            [req.session.userId]
        );

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
