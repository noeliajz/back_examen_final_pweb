// controllers/whatsappClient.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let ready = false; // Estado del cliente

// 🧩 Crear cliente con autenticación local
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "pweb-session" }),
  puppeteer: {
    headless: true, // poné false si querés ver el navegador
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// 📲 Mostrar QR para autenticación
client.on('qr', qr => {
  console.clear();
  console.log('📲 Escaneá este código QR con tu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// ✅ Confirmación de autenticación
client.on('authenticated', () => {
  console.log('✅ Autenticado con éxito.');
});

// 🟢 Cliente listo para enviar mensajes
client.on('ready', () => {
  ready = true;
  console.log('🟢 Cliente de WhatsApp listo para enviar mensajes.');
  console.log('🔍 Valor actual de ready:', ready);
  if (client.info) {
    console.log('👤 Info del cliente:', client.info);
  } else {
    console.log('⚠️ client.info todavía no disponible.');
  }
});

// 🔴 Manejo de desconexión
client.on('disconnected', reason => {
  ready = false;
  console.log('🔴 Cliente de WhatsApp desconectado:', reason);
  console.log('🔍 Valor actual de ready:', ready);
});

// ⚙️ Inicializar cliente
client.initialize().catch(err => {
  console.error('❌ Error al inicializar cliente WhatsApp:', err);
});

// ✅ Exportamos el cliente y una función para obtener el estado actual
module.exports = {
  client,
  isReady: () => ready
};
