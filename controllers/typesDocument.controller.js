import TypesDocument from "../models/TypesDocument.model.js";

export const getAllTypesDocuments = async (req, res) => {
  try {
    const types = await TypesDocument.find();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      error: error.message,
    });
  }
};
