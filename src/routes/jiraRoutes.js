const express = require('express');
const router = express.Router();
const { processJiraData } = require('../controllers/jiraController');
const multer = require('multer');

// Configuração do multer para upload de imagens em memória
const upload = multer({ storage: multer.memoryStorage() });

router.post('/process', upload.single('screenshot'), processJiraData);

module.exports = router;
