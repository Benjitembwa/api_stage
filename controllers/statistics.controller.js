import Attente from "../models/Attente.model.js";
import Document from "../models/Document.model.js";
import Etudiant from "../models/Etudiant.model.js";
import Personnel from "../models/Personnel.model.js";

export const getStatistics = async (req, res) => {
  try {
    const etudiantsCount = await Etudiant.countDocuments();
    const personnelCount = await Personnel.countDocuments();
    const totalUsers = etudiantsCount + personnelCount;

    const documentsCount = await Document.countDocuments();

    const attenteCount = await Attente.countDocuments({ status: "En attente" });

    res.json({
      totalUsers,
      documentsCount,
      attenteCount,
    });
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getPieChartData = async (req, res) => {
  try {
    // On regroupe les documents par typeDocument
    const results = await Document.aggregate([
      {
        $group: {
          _id: "$typeDocument",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "typesdocuments", // nom de la collection en minuscules et pluriel
          localField: "_id",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      {
        $unwind: "$typeInfo",
      },
      {
        $project: {
          _id: 0,
          label: "$typeInfo.nom",
          count: 1,
        },
      },
    ]);

    const labels = results.map((item) => item.label);
    const data = results.map((item) => item.count);

    res.json({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
        },
      ],
    });
  } catch (error) {
    console.error("Erreur pie chart :", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des données du graphique." });
  }
};

export const getLineChartData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const results = await Document.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Initialise les données pour chaque mois
    const monthlyCounts = Array(12).fill(0);
    results.forEach((item) => {
      monthlyCounts[item._id - 1] = item.count; // -1 car mois commence à 1
    });

    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    res.json({
      labels,
      datasets: [
        {
          label: "Documents émis",
          data: monthlyCounts,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          tension: 0.4,
        },
      ],
    });
  } catch (error) {
    console.error("Erreur line chart :", error);
    res.status(500).json({
      error: "Erreur lors du chargement des données du graphique linéaire.",
    });
  }
};

export const getAdvancedStats = async (req, res) => {
  try {
    // Documents par type
    const documentsByType = await Document.aggregate([
      {
        $lookup: {
          from: "typesdocuments",
          localField: "typeDocument",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      { $unwind: "$typeInfo" },
      {
        $group: {
          _id: "$typeInfo.nom",
          count: { $sum: 1 },
        },
      },
    ]);

    const documentsByMention = await Document.aggregate([
      {
        $match: {
          proprietaireModel: "Etudiant", // Filtre uniquement les Etudiants (ajuste selon ton besoin)
        },
      },
      {
        $lookup: {
          from: "etudiants", // Nom de la collection MongoDB des Etudiants
          localField: "proprietaire",
          foreignField: "_id",
          as: "etudiant",
        },
      },
      {
        $unwind: "$etudiant",
      },
      {
        $lookup: {
          from: "mentions", // Collection MongoDB pour Mention
          localField: "etudiant.mention",
          foreignField: "_id",
          as: "mention",
        },
      },
      {
        $unwind: "$mention",
      },
      {
        $group: {
          _id: "$mention.nom",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Distribution par status
    const approvedCount = await Document.countDocuments();
    const rejectedCount = await Attente.countDocuments({ status: "Rejeté" });
    const pendingCount = await Attente.countDocuments({ status: "En attente" });

    // Évolution mensuelle par type
    const start = new Date(new Date().getFullYear(), 0, 1);
    const evolution = await Document.aggregate([
      {
        $match: {
          createdAt: { $gte: start },
        },
      },
      {
        $lookup: {
          from: "typesdocuments",
          localField: "typeDocument",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      { $unwind: "$typeInfo" },
      {
        $project: {
          month: { $month: "$createdAt" },
          type: "$typeInfo.nom",
        },
      },
      {
        $group: {
          _id: { month: "$month", type: "$type" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.json({
      documentsByType,
      documentsByMention,
      statusDistribution: {
        Approuvées: approvedCount,
        Rejetées: rejectedCount,
        EnAttente: pendingCount,
      },
      evolution,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur lors de la récupération des statistiques avancées",
    });
  }
};

export const getDocumentsByMentionAndType = async (req, res) => {
  try {
    const result = await Document.aggregate([
      {
        $match: {
          proprietaireModel: "Etudiant",
        },
      },
      {
        $lookup: {
          from: "etudiants",
          localField: "proprietaire",
          foreignField: "_id",
          as: "etudiant",
        },
      },
      { $unwind: "$etudiant" },
      {
        $lookup: {
          from: "mentions",
          localField: "etudiant.mention",
          foreignField: "_id",
          as: "mention",
        },
      },
      { $unwind: "$mention" },
      {
        $lookup: {
          from: "typesdocuments",
          localField: "typeDocument",
          foreignField: "_id",
          as: "typeDocument",
        },
      },
      { $unwind: "$typeDocument" },
      {
        $group: {
          _id: {
            mention: "$mention.nom",
            type: "$typeDocument.nom",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.mention",
          countsByType: {
            $push: {
              type: "$_id.type",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          mention: "$_id",
          lettreDeStage: {
            $let: {
              vars: {
                found: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$countsByType",
                        as: "item",
                        cond: { $eq: ["$$item.type", "Lettre de stage"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$found.count", 0] },
            },
          },
          releveDeNotes: {
            $let: {
              vars: {
                found: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$countsByType",
                        as: "item",
                        cond: { $eq: ["$$item.type", "Relevé de notes"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$found.count", 0] },
            },
          },
          attestationDeReussite: {
            $let: {
              vars: {
                found: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$countsByType",
                        as: "item",
                        cond: {
                          $eq: ["$$item.type", "Attestation de réussite"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$found.count", 0] },
            },
          },
          ordreDeMission: {
            $let: {
              vars: {
                found: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$countsByType",
                        as: "item",
                        cond: { $eq: ["$$item.type", "Ordre de mission"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$found.count", 0] },
            },
          },
        },
      },
      {
        $sort: { mention: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de l'agrégation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
