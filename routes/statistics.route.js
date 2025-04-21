import express from "express";
import {
  getAdvancedStats,
  getDocumentsByMentionAndType,
  getLineChartData,
  getPieChartData,
  getStatistics,
} from "../controllers/statistics.controller.js";

const statisticsRoutes = express.Router();

statisticsRoutes.get("/", getStatistics);
statisticsRoutes.get("/piechart", getPieChartData);
statisticsRoutes.get("/linechart", getLineChartData);
statisticsRoutes.get("/advanced-stats", getAdvancedStats);
statisticsRoutes.get(
  "/documents-by-mention-and-type",
  getDocumentsByMentionAndType
);

export default statisticsRoutes;
