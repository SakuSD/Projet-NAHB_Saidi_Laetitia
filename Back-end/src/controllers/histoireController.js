import { db } from "../config/db.js";

// =============================
// CRÉER UNE HISTOIRE
// =============================
export const createHistoire = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Utilisateur non connecté." });
        }

        const { titre, description } = req.body;

        const [result] = await db.query(
            `INSERT INTO histoires (titre, description, auteurId)
             VALUES (?, ?, ?)`,
            [titre, description ?? null, req.session.userId]
        );

        res.status(201).json({
            id: result.insertId,
            titre,
            description,
            auteurId: req.session.userId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// HISTOIRES PUBLIÉES
// =============================
export const getHistoiresPubliees = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM histoires WHERE statut = 'published'`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// HISTOIRES PAR AUTEUR
// =============================
export const getHistoiresByAuteur = async (req, res) => {
    try {
        const { auteurId } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM histoires WHERE auteurId = ?`,
            [auteurId]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// METTRE À JOUR UNE HISTOIRE
// =============================
export const updateHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, description } = req.body;

        const fields = [];
        const params = [];

        if (titre !== undefined) {
            fields.push("titre = ?");
            params.push(titre);
        }

        if (description !== undefined) {
            fields.push("description = ?");
            params.push(description);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Aucune donnée à mettre à jour." });
        }

        params.push(id);

        await db.query(
            `UPDATE histoires SET ${fields.join(", ")} WHERE id = ?`,
            params
        );

        const [updated] = await db.query(
            `SELECT * FROM histoires WHERE id = ?`,
            [id]
        );

        res.json(updated[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// SUPPRIMER UNE HISTOIRE
// =============================
export const deleteHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM pages WHERE histoireId = ?`, [id]);
        await db.query(`DELETE FROM histoires WHERE id = ?`, [id]);

        res.json({ message: "Histoire supprimée avec succès." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// CHANGER LE STATUT (draft / published)
// =============================
export const updateStatutHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const allowed = ["draft", "published"];

        if (!allowed.includes(statut)) {
            return res.status(400).json({
                error: "Statut invalide. Valeurs possibles : draft, published"
            });
        }

        await db.query(
            `UPDATE histoires SET statut = ? WHERE id = ?`,
            [statut, id]
        );

        const [updated] = await db.query(
            `SELECT * FROM histoires WHERE id = ?`,
            [id]
        );

        res.json(updated[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// PUBLIER UNE HISTOIRE
// =============================
export const publishHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`UPDATE histoires SET statut = 'published' WHERE id = ?`, [id]);

        const [updated] = await db.query(`SELECT * FROM histoires WHERE id = ?`, [id]);

        res.json(updated[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// BANNIR UNE HISTOIRE
// =============================
export const banHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`UPDATE histoires SET statut = 'banned' WHERE id = ?`, [id]);

        const [updated] = await db.query(`SELECT * FROM histoires WHERE id = ?`, [id]);

        res.json(updated[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
