// controllers/whatsappController.js
const { client, isReady } = require("./whatsappClient");


const sendMessage = async (req, res) => {
  try {
    console.log("📨 Petición recibida en /api/whatsapp/send");
    console.log("📡 Estado actual de isReady:", isReady());

    const { telefono, fecha, doctor } = req.body;

    if (!isReady() || !client.info || !client.info.wid) {
      console.log("⚠️ Cliente no listo. Abortando envío...");
      return res.status(503).json({
        ok: false,
        msg: "WhatsApp aún no está conectado o está desconectado.",
      });
    }

    const chatId = `${telefono}@c.us`;
    const mensaje = `📅 Hola! Recordatorio de tu turno con el Dr/a ${doctor} el día ${fecha}.`;

    console.log("📤 Enviando mensaje a:", chatId);

    // 🔹 AGREGÁ ESTAS DOS LÍNEAS:
    const response = await client.sendMessage(chatId, mensaje);
    console.log("📬 Respuesta de WhatsApp:", response);

    console.log("✅ Mensaje enviado correctamente");

    res.json({
      ok: true,
      msg: "Mensaje enviado correctamente ✅",
    });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al enviar el mensaje.",
      error: error.message,
    });
  }
};

module.exports = { sendMessage };


