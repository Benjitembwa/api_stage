import bcrypt from "bcryptjs";
import Personnel from "../models/Personnel.model.js";

export const registerPersonnel = async (req, res) => {
  try {
    const { nom, email, motDePasse, mention } = req.body;
    console.log(req.body);
    const existing = await Personnel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const nouveauPersonnel = new Personnel({
      nom,
      email,
      motDePasse: hashedPassword,
      mention,
    });

    await nouveauPersonnel.save();
    res.status(201).json({ message: "Personnel inscrit avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const loginPersonnel = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const personnel = await Personnel.findOne({ email });
    if (!personnel) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(motDePasse, personnel.motDePasse);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    res.json({
      message: "Connexion réussie",
      utilisateur: {
        id: personnel._id,
        nom: personnel.nom,
        email: personnel.email,
        role: personnel.role,
        mention: personnel.mention,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
