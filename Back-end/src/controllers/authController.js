import User from "../model/Utilisateur.js";
import bcrypt from "bcrypt";

// INSCRIPTION
export const register = async (req, res) => {
    try {
        const { pseudo, email, motDePasse, role } = req.body;

        const userExiste = await User.findOne({ email });
        if (userExiste) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        const hash = await bcrypt.hash(motDePasse, 10);

        const user = await User.create({
            pseudo,
            email,
            motDePasse: hash,
            role: role || "lecteur"
        });

        req.session.userId = user._id;

        res.status(201).json({ message: "Compte créé.", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CONNEXION
export const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Utilisateur introuvable." });

        const match = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!match) return res.status(400).json({ message: "Mot de passe incorrect." });

        req.session.userId = user._id;

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

// DECONNEXION
export const logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Déconnecté." });
};

// INFO DU USER CONNECTÉ
export const me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Non connecté." });
        }

        const user = await User.findById(req.session.userId).select("-motDePasse");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
