const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const { getReporteObrasSociales, getReporteObrasPorDoctor } = require("../controllers/reportes");

// GET /api/reportes/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    // Trae todos los doctores con sus turnos
    const doctores = await Doctor.find();

    if (!doctores.length) {
      return res.json({
        medicos: [],
        totalAsignados: 0,
        totalAsistidos: 0,
      });
    }

    // Procesar los datos para el frontend
    const medicos = doctores.map((doc) => {
      const turnosAsignados = doc.turnos.length;
      const turnosAsistidos = doc.turnos.filter((t) => t.asistencia).length;

      return {
        nombre: `${doc.nombre} ${doc.apellido}`,
        turnosAsignados,
        turnosAsistidos,
      };
    });

    // Totales generales
    const totalAsignados = medicos.reduce((sum, m) => sum + m.turnosAsignados, 0);
    const totalAsistidos = medicos.reduce((sum, m) => sum + m.turnosAsistidos, 0);

    res.json({
      medicos,
      totalAsignados,
      totalAsistidos,
    });
  } catch (error) {
    console.error("Error al obtener el dashboard:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Nueva ruta: reporte de obras sociales
router.get('/obras-sociales', getReporteObrasSociales);

// 🔹 Nuevo endpoint para el reporte filtrado
router.get("/obras-sociales/:idDoctor", getReporteObrasPorDoctor);

module.exports = router;
