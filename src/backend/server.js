/**
 * Servidor principal do Sistema RIRA 21
 * Sistema de Comunicação Interna para Consultórios e Clínicas
 */

// Importações de módulos principais
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Importações de módulos internos
const config = require('./config/config');
const setupRoutes = require('./routes/routes');
const { setupSecurityMiddleware } = require('./utils/security');
const { setupSocketEvents } = require('./controllers/socketController');

// Inicialização da aplicação Express
const app = express();

// Configurações de CORS
app.use(cors(config.security.cors));

// Configurações de segurança
setupSecurityMiddleware(app);

// Configuração de rotas
setupRoutes(app);

// Criação do servidor HTTP
const server = http.createServer(app);

// Configuração do Socket.io
const io = socketIo(server, {
  cors: config.security.cors
});

// Configuração dos eventos do Socket.io
io.on("connection", setupSocketEvents);

// Tratamento de erros do servidor
server.on('error', (error) => {
  console.error('Erro no servidor:', error);
});

// Iniciar o servidor
server.listen(config.server.port, () => {
  console.log(`\n======================================`);
  console.log(`🚀 Servidor ${config.system.name} rodando na porta ${config.server.port}`);
  
  if (config.server.isReplit) {
    console.log(`📺 Acesse o servidor através da URL do seu Replit`);
    console.log(`   Use os caminhos: /tv ou /painel`);
  } else {
    console.log(`📺 TV: http://localhost:${config.server.port}/tv`);
    console.log(`🎛️ Painel: http://localhost:${config.server.port}/painel`);
    console.log(`📊 Status: http://localhost:${config.server.port}/status`);
  }
  
  console.log(`Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
  console.log(`======================================\n`);
}); 