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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
