const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const {
  getReporteDashboard,
  getReporteObrasSociales,
  getReporteObrasPorDoctor,
} = require("../controllers/reportes");

// Dashboard general
router.get("/dashboard", getReporteDashboard);

// Obras sociales general
router.get("/obras-sociales", getReporteObrasSociales);

// Obras sociales por doctor (con filtros)
router.get("/obras-sociales/:idDoctor", getReporteObrasPorDoctor);

module.exports = router;
