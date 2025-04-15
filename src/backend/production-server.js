/**
 * Servidor otimizado para produção do Sistema RIRA 21
 */

// Módulos fundamentais
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

// Inicialização da aplicação
const app = express();
const PORT = process.env.PORT || 3001;
const clients = {};

// Configurações
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rotas principais
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/tv/index.html')));
app.get('/tv', (req, res) => res.sendFile(path.join(__dirname, '../frontend/tv/index.html')));
app.get('/painel', (req, res) => res.sendFile(path.join(__dirname, '../frontend/painel/index.html')));
app.get('/status', (req, res) => res.json({
  status: 'online',
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  connections: Object.keys(clients).length
}));

// Configuração do servidor HTTP e Socket.io
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Lógica de WebSocket
io.on("connection", (socket) => {
  // Registro de cliente
  socket.on("register", ({ type, id }) => {
    if (!clients[id]) clients[id] = [];
    clients[id].push(socket);
    socket.emit("registered", { success: true, message: `Registrado como ${type}` });
  });

  // Envio de mensagens
  socket.on("send_message", ({ target, payload }) => {
    const targets = Array.isArray(target) ? target : [target];
    let entregues = 0;
    
    targets.forEach(t => {
      if (clients[t]) {
        clients[t].forEach(s => {
          s.emit("message", payload);
          entregues++;
        });
      }
    });
    
    socket.emit("message_sent", { 
      success: entregues > 0,
      targets: targets, 
      delivered: entregues,
      timestamp: new Date().toISOString()
    });
  });

  // Desconexão
  socket.on("disconnect", () => {
    for (const [id, list] of Object.entries(clients)) {
      const index = list.findIndex(s => s.id === socket.id);
      if (index !== -1) {
        clients[id].splice(index, 1);
        if (clients[id].length === 0) delete clients[id];
        break;
      }
    }
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor RIRA 21 rodando na porta ${PORT}`);
  console.log(`TV: http://localhost:${PORT}/tv`);
  console.log(`Painel: http://localhost:${PORT}/painel`);
}); 