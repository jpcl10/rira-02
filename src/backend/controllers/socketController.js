/**
 * Controlador para eventos do Socket.io
 */

const clientManager = require('../services/clientManager');

/**
 * Configura os eventos de socket para um cliente
 * @param {object} socket - Socket do cliente
 */
function setupSocketEvents(socket) {
  console.log(`Cliente conectado: ${socket.id}`);

  // Evento de registro
  socket.on("register", ({ type, id }) => {
    clientManager.registerClient(id, socket, type);
    
    // Enviar confirmação para o cliente
    socket.emit("registered", { 
      success: true, 
      message: `Registrado como ${type}` 
    });
  });

  // Evento de envio de mensagem
  socket.on("send_message", ({ target, payload }) => {
    const entregues = clientManager.sendMessage(target, payload);
    
    // Feedback para o remetente
    socket.emit("message_sent", { 
      success: entregues > 0,
      targets: Array.isArray(target) ? target : [target], 
      delivered: entregues,
      timestamp: new Date().toISOString()
    });
  });

  // Evento de desconexão
  socket.on("disconnect", () => {
    const clientId = clientManager.removeClient(socket);
    console.log(`Cliente desconectado: ${socket.id}${clientId ? ` (ID: ${clientId})` : ''}`);
  });
  
  // Tratamento de erros
  socket.on("error", (error) => {
    console.error(`Erro no socket ${socket.id}:`, error);
  });
}

module.exports = {
  setupSocketEvents
}; 