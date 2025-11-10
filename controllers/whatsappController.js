// controllers/whatsappController.js
/* const { client, isReady } = require("./whatsappClient");


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

module.exports = { sendMessage }; */
// controllers/whatsappController.js
const { client, isReady } = require("./whatsappClient");

const sendMessage = async (req, res) => {
  console.log("📨 Petición recibida en /api/whatsapp/send");
  console.log("📡 Estado actual de isReady:", isReady());

  try {
    const { telefono, fecha, doctor } = req.body;

    if (!isReady() || !client.info || !client.info.wid) {
      console.log("⚠️ Cliente no listo. Abortando envío...");
      return res.status(503).json({
        ok: false,
        msg: "WhatsApp aún no está conectado o el cliente no está listo.",
      });
    }

    if (!telefono || !fecha || !doctor) {
      return res.status(400).json({
        ok: false,
        msg: "Faltan datos obligatorios (teléfono, fecha o doctor).",
      });
    }

    const phone = telefono.replace(/[^0-9]/g, "");
    const mensaje = `📅 Hola! Recordatorio de tu turno con el Dr/a ${doctor} el día ${fecha}.`;

    // 🔹 Verificar si el número tiene cuenta de WhatsApp
    const numberId = await client.getNumberId(phone);
    if (!numberId) {
      console.log("🚫 El número no tiene cuenta de WhatsApp:", phone);
      return res.status(400).json({
        ok: false,
        msg: "El número no tiene una cuenta de WhatsApp activa.",
      });
    }

    // 🔹 Enviar mensaje
    console.log("📤 Enviando mensaje a:", numberId._serialized);
    const response = await client.sendMessage(numberId._serialized, mensaje);

    console.log("✅ Mensaje enviado correctamente:", response.id.id);

    return res.status(200).json({
      ok: true,
      msg: "Mensaje enviado correctamente ✅",
    });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);

    // ⚠️ Error típico: usuario sin chat previo
    if (error.message && error.message.includes("No LID for user")) {
      return res.status(400).json({
        ok: false,
        msg: "No se pudo enviar el mensaje porque el usuario nunca chateó con este número. Pedile que te envíe un mensaje primero.",
      });
    }

    // ⚠️ Error genérico
    return res.status(500).json({
      ok: false,
      msg: "Error interno al enviar el mensaje.",
      error: error.message,
    });
  }
};

module.exports = { sendMessage };



