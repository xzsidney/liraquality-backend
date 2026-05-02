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

// Rota de Teste / Diagnóstico (A pedido do usuário)
app.get('/', async (req, res) => {
  try {
    // Tenta autenticar no banco
    await sequelize.authenticate();
    // Busca as tabelas existentes
    const [results] = await sequelize.query("SHOW TABLES");
    const tables = results.map(row => Object.values(row)[0]);
    
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; background: #f8fafc; color: #0f172a;">
          <h1 style="color: #059669;">✅ LiraQuality API - Servidor Online</h1>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 20px;">
            <p><strong>Status do Banco de Dados:</strong> <span style="color: #059669; font-weight: bold;">Conectado com Sucesso!</span></p>
            <p><strong>Tabelas Encontradas (${tables.length}):</strong></p>
            <ul>
              ${tables.length > 0 ? tables.map(t => `<li>${t}</li>`).join('') : '<li>Nenhuma tabela encontrada. O sync() pode ter falhado ou ainda está rodando.</li>'}
            </ul>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; background: #fef2f2; color: #991b1b;">
          <h1 style="color: #dc2626;">❌ LiraQuality API - Erro Crítico</h1>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #fecaca; margin-top: 20px;">
            <p><strong>Status do Banco de Dados:</strong> <span style="color: #dc2626; font-weight: bold;">Falha na Conexão</span></p>
            <p>Verifique suas variáveis de ambiente na Hostinger (DB_USER, DB_PASSWORD, DB_NAME, DB_HOST).</p>
            <hr style="border: 1px solid #fee2e2; margin: 20px 0;">
            <h3>Detalhe do Erro (Log Técnico):</h3>
            <pre style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto;">${error.message}</pre>
          </div>
        </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
