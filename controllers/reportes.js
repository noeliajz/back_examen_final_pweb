// En tu backend (reporte.js o similar)

const DoctorModel = require('../models/doctor');

const getReporteDashboard = async (req, res) => {
  try {
    const reportes = await DoctorModel.aggregate([
      { $unwind: "$turnos" },
      { 
        $group: {
          _id: "$_id",
          nombre: { $first: "$nombre" },
          apellido: { $first: "$apellido" },
          turnosAsignados: { $sum: 1 },
          turnosAsistidos: { 
            $sum: { $cond: [{ $eq: ["$turnos.asistencia", true] }, 1, 0] } 
          }
        }
      },
      {
        $project: {
          _id: 0,
          nombre: { $concat: ["$nombre", " ", "$apellido"] },
          turnosAsignados: 1,
          turnosAsistidos: 1,
        }
      }
    ]);

    // Calcular totales generales
    const totalAsignados = reportes.reduce((sum, m) => sum + m.turnosAsignados, 0);
    const totalAsistidos = reportes.reduce((sum, m) => sum + m.turnosAsistidos, 0);

    res.status(200).json({ 
      msg: "Reporte de dashboard generado", 
      medicos: reportes,
      totalAsignados,
      totalAsistidos
    });

  } catch (error) {
    console.error("Error al generar reporte:", error);
    res.status(500).json({ msg: 'Error interno del servidor al generar reportes' });
  }
};


module.exports = { getReporteDashboard };

// Debes agregar la ruta en tu archivo de rutas: 
// router.get('/reportes/dashboard', getReporteDashboard);