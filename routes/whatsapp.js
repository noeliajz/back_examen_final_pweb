// routes/whatsapp.js
const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/whatsappController");

router.post("/send", sendMessage);

module.exports = router;
