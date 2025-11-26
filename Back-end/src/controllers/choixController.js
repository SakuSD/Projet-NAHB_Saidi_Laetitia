import { db } from "../config/db.js";

// =============================
// CRÉER UN CHOIX
// =============================
export const createChoix = async (req, res) => {
    try {
        const { pageId, texte, prochainePageId } = req.body;

        const [result] = await db.query(
            `INSERT INTO choix (pageId, texte, prochainePageId)
             VALUES (?, ?, ?)`,
            [pageId, texte, prochainePageId ?? null]
        );

        res.status(201).json({
            id: result.insertId,
            pageId,
            texte,
            prochainePageId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// CHOIX D’UNE PAGE
// =============================
export const getChoixByPage = async (req, res) => {
    try {
        const { pageId } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM choix WHERE pageId = ?`,
            [pageId]
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// METTRE À JOUR UN CHOIX
// =============================
export const updateChoix = async (req, res) => {
    try {
        const { id } = req.params;
        const { texte, prochainePageId } = req.body;

        const fields = [];
        const params = [];

        if (texte !== undefined) {
            fields.push("texte = ?");
            params.push(texte);
        }

        if (prochainePageId !== undefined) {
            fields.push("prochainePageId = ?");
            params.push(prochainePageId);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Aucune donnée à mettre à jour." });
        }

        params.push(id);

        await db.query(
            `UPDATE choix SET ${fields.join(", ")} WHERE id = ?`,
            params
        );

        const [updated] = await db.query(`SELECT * FROM choix WHERE id = ?`, [id]);

        res.json(updated[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =============================
// SUPPRIMER UN CHOIX
// =============================
export const deleteChoix = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM choix WHERE id = ?`, [id]);

        res.json({ message: "Choix supprimé avec succès." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
