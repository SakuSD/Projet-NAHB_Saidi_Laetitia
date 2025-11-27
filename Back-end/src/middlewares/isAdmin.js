export const isAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Non connecté." });
    }

    if (req.session.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé : admin uniquement." });
    }

    next();
};
