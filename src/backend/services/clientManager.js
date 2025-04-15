/**
 * Serviço de gerenciamento de clientes WebSocket
 * Responsável por registrar, remover e gerenciar os clientes conectados
 */

// Armazena os clientes conectados por ID
const clients = {};

/**
 * Registra um novo cliente
 * @param {string} id - ID do cliente
 * @param {object} socket - Socket do cliente
 * @param {string} type - Tipo do cliente (tv, painel, etc)
 * @returns {boolean} Sucesso da operação
 */
function registerClient(id, socket, type) {
  if (!clients[id]) clients[id] = [];
  clients[id].push(socket);
  console.log(`[REGISTER] ${type} registrado com ID: ${id}`);
  return true;
}

/**
 * Remove um cliente
 * @param {object} socket - Socket do cliente
 * @returns {string|null} ID do cliente removido ou null
 */
function removeClient(socket) {
  let clientId = null;
  
  // Encontrar e remover o cliente desconectado
  for (const [id, list] of Object.entries(clients)) {
    const index = list.findIndex(s => s.id === socket.id);
    if (index !== -1) {
      clientId = id;
      clients[id].splice(index, 1);
      if (clients[id].length === 0) delete clients[id];
      break;
    }
  }
  
  return clientId;
}

/**
 * Envia uma mensagem para um ou mais destinos
 * @param {string|array} target - ID ou array de IDs dos destinos
 * @param {object} payload - Conteúdo da mensagem
 * @returns {number} Número de clientes que receberam a mensagem
 */
function sendMessage(target, payload) {
  const targets = Array.isArray(target) ? target : [target];
  let entregues = 0;
  
  // Log da mensagem sendo enviada
  console.log(`[MENSAGEM] Tipo: ${payload.type}, Destino: ${targets.join(', ')}`);
  
  targets.forEach(t => {
    if (clients[t]) {
      clients[t].forEach(s => {
        s.emit("message", payload);
        entregues++;
      });
    }
  });
  
  console.log(`[ENTREGA] Mensagem entregue para ${entregues} cliente(s)`);
  return entregues;
}

/**
 * Retorna o número total de clientes conectados
 * @returns {number} Número de clientes
 */
function getClientCount() {
  return Object.keys(clients).length;
}

/**
 * Retorna a lista de clientes conectados
 * @returns {object} Lista de clientes
 */
function getClients() {
  return clients;
}

module.exports = {
  registerClient,
  removeClient,
  sendMessage,
  getClientCount,
  getClients
}; 