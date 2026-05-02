require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const jiraRoutes = require('./routes/jiraRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Conectar ao Banco e sincronizar modelos
connectDB().then(async () => {
  // Sincroniza os modelos com o banco (cria tabelas se não existirem)
  await sequelize.sync({ alter: true });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/jira', jiraRoutes);

// Rota de Health Check (Segura para Produção)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'LiraQuality API v1.0',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
