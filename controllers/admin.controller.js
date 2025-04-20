import Admin from "../models/Admin.model.js";

export const loginAdmin = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.motDePasse !== motDePasse) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    res.status(200).json({ message: "Connexion réussie", admin });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
