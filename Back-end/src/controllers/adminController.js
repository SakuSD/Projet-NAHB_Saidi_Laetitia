import { db } from "../config/db.js";
// Désuspendre une histoire
export const unsuspendHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE histoires SET estSuspendue = 0 WHERE id = ?",
            [id]
        );

        res.json({ message: "Histoire désuspendue." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Bannir un utilisateur
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Bannir l'utilisateur
        await db.query(
            "UPDATE utilisateurs SET estBanni = 1 WHERE id = ?",
            [id]
        );

        // Mettre à jour le statut des histoires de cet utilisateur
        await db.query(
            "UPDATE histoires SET statut = 'banned' WHERE auteurId = ?",
            [id]
        );

        res.json({ message: "Utilisateur banni et histoires associées mises à jour." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Suspendre une histoire
export const suspendHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE histoires SET estSuspendue = 1 WHERE id = ?",
            [id]
        );

        res.json({ message: "Histoire suspendue." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Réactiver une histoire (annule la suspension)
export const reactivateHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE histoires SET estSuspendue = 0 WHERE id = ?",
            [id]
        );

        res.json({ message: "Histoire réactivée." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Statistiques des histoires
export const statsHistoires = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT h.id, h.titre, COUNT(p.id) as parties
            FROM histoires h
            LEFT JOIN parties p ON p.histoireId = h.id
            GROUP BY h.id
        `);

        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Débannir l'utilisateur
        await db.query(
            "UPDATE utilisateurs SET estBanni = 0 WHERE id = ?",
            [id]
        );

        // Remettre les histoires "banned" de cet utilisateur en "published"
        await db.query(
            "UPDATE histoires SET statut = 'published' WHERE auteurId = ? AND statut = 'banned'",
            [id]
        );

        res.json({ message: "Utilisateur débanni et histoires remises en published." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Non connecté." });
        }

        const [rows] = await db.query(
            "SELECT role FROM utilisateurs WHERE id = ?",
            [req.session.userId]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Utilisateur introuvable." });
        }

        if (rows[0].role !== "admin") {
            return res.status(403).json({ message: "Accès refusé : admin uniquement." });
        }

        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};