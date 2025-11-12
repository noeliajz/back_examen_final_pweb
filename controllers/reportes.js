const DoctorModel = require('../models/doctor');

// ========================================
// 📊 DASHBOARD PRINCIPAL (ya lo tenías)
// ========================================
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

// ========================================
// 🩺 NUEVO REPORTE: OBRAS SOCIALES
// ========================================
const getReporteObrasSociales = async (req, res) => {
  try {
    const doctores = await DoctorModel.find()
      .populate('turnos.usuario', 'obraSocial')
      .lean();

    const conteoObras = {};

    doctores.forEach((doctor) => {
      if (Array.isArray(doctor.turnos)) {
        doctor.turnos.forEach((turno) => {
          if (turno.usuario && turno.usuario.obraSocial) {
            const os = turno.usuario.obraSocial.trim();
            conteoObras[os] = (conteoObras[os] || 0) + 1;
          }
        });
      }
    });

    const obrasSociales = Object.entries(conteoObras).map(([obraSocial, cantidad]) => ({
      obraSocial,
      cantidad,
    }));

    res.status(200).json({
      msg: "Reporte de obras sociales generado",
      obrasSociales,
    });
  } catch (error) {
    console.error("Error al generar reporte de obras sociales:", error);
    res.status(500).json({ msg: "Error interno del servidor al generar reporte de obras sociales" });
  }
};


module.exports = { 
  getReporteDashboard,
  getReporteObrasSociales
};
