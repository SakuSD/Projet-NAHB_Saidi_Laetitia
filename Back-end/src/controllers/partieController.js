import { db } from "../config/db.js";

// ===============================
// ENREGISTRER UNE PARTIE JOUÉE
// ===============================
export const enregistrerPartie = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Utilisateur non connecté." });
        }

        const { histoireId, pageFinId } = req.body;

        if (!histoireId || !pageFinId) {
            return res.status(400).json({ error: "histoireId et pageFinId obligatoires." });
        }

        const [result] = await db.query(
            `INSERT INTO parties (utilisateurId, histoireId, pageActuelleId)
             VALUES (?, ?, ?)`,
            [req.session.userId, histoireId, pageFinId]
        );

        res.status(201).json({ message: "Partie enregistrée.", id: result.insertId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ===============================
// STATISTIQUES DES HISTOIRES (ADMIN)
// ===============================
export const getStatsHistoires = async (req, res) => {
    try {
        if (!req.session.userId || req.session.role !== "admin") {
            return res.status(403).json({ error: "Accès réservé à l'admin." });
        }

        const [rows] = await db.query(`
            SELECT h.id, h.titre, COUNT(p.id) as nombreParties
            FROM histoires h
            LEFT JOIN parties p ON p.histoireId = h.id
            GROUP BY h.id
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
