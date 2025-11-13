const DoctorModel = require("../models/doctor");

// ========================================
// 📊 DASHBOARD PRINCIPAL
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
            $sum: { $cond: [{ $eq: ["$turnos.asistencia", true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          nombre: { $concat: ["$nombre", " ", "$apellido"] },
          turnosAsignados: 1,
          turnosAsistidos: 1,
        },
      },
    ]);

    // Calcular totales generales
    const totalAsignados = reportes.reduce(
      (sum, m) => sum + m.turnosAsignados,
      0
    );
    const totalAsistidos = reportes.reduce(
      (sum, m) => sum + m.turnosAsistidos,
      0
    );

    res.status(200).json({
      msg: "Reporte de dashboard generado",
      medicos: reportes,
      totalAsignados,
      totalAsistidos,
    });
  } catch (error) {
    console.error("Error al generar reporte:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor al generar reportes" });
  }
};

// ========================================
// 🩺 REPORTE GENERAL: TODAS LAS OBRAS SOCIALES
// ========================================
const getReporteObrasSociales = async (req, res) => {
  try {
    const doctores = await DoctorModel.find()
      .populate("turnos.usuario", "obraSocial")
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

    const obrasSociales = Object.entries(conteoObras).map(
      ([obraSocial, cantidad]) => ({
        obraSocial,
        cantidad,
      })
    );

    res.status(200).json({
      msg: "Reporte de obras sociales generado",
      obrasSociales,
    });
  } catch (error) {
    console.error("Error al generar reporte de obras sociales:", error);
    res.status(500).json({
      msg: "Error interno del servidor al generar reporte de obras sociales",
    });
  }
};

// ========================================
// 🩺 REPORTE POR DOCTOR + FILTRO MES/AÑO
// ========================================
const getReporteObrasPorDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const { mes, anio } = req.query;

    const doctor = await DoctorModel.findById(idDoctor)
      .populate("turnos.usuario", "obraSocial")
      .lean();

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor no encontrado" });
    }

    let turnosFiltrados = doctor.turnos || [];

    // 🗓️ Si hay filtros de mes y año, filtramos por fecha
    if (anio) {
      const anioInt = parseInt(anio);
      const mesInt = mes ? parseInt(mes) - 1 : null;

      turnosFiltrados = turnosFiltrados.filter((turno) => {
        if (!turno.fecha) return false;
        const fechaTurno = new Date(turno.fecha);
        const cumpleAnio = fechaTurno.getFullYear() === anioInt;
        const cumpleMes = mesInt === null || fechaTurno.getMonth() === mesInt;
        return cumpleAnio && cumpleMes;
      });
    }

    // 📊 Contar obras sociales
    const conteoObras = {};
    turnosFiltrados.forEach((turno) => {
      if (turno.usuario && turno.usuario.obraSocial) {
        const os = turno.usuario.obraSocial.trim();
        conteoObras[os] = (conteoObras[os] || 0) + 1;
      }
    });

    const obrasSociales = Object.entries(conteoObras).map(
      ([obraSocial, cantidad]) => ({
        obraSocial,
        cantidad,
      })
    );

    res.status(200).json({
      msg: "Reportes de obras sociales del doctor/a generado",
      filtrosAplicados: { mes: mes || "todos", anio: anio || "todos" },
      obrasSociales,
    });
  } catch (error) {
    console.error("Error al generar reporte de obras sociales del doctor:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports = {
  getReporteDashboard,
  getReporteObrasSociales,
  getReporteObrasPorDoctor
};
