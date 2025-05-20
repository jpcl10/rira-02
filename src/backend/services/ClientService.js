/**
 * Serviço de gerenciamento de clientes
 * Implementa a lógica de negócios relacionada aos clientes conectados
 * 
 * Este serviço consolida as funcionalidades de gerenciamento de clientes
 * anteriormente divididas entre ClientService.js e clientManager.js
 */

const { Client } = require('../models');

class ClientService {
  constructor() {
    // Mapa de clientes por ID
    this.clientsMap = new Map();
    
    // Para compatibilidade com o clientManager.js
    this._legacyClients = {};
  }

  /**
   * Registra um novo cliente
   * @param {string} id - ID do cliente
   * @param {object} socket - Socket do cliente
   * @param {string} type - Tipo do cliente (tv, painel, etc)
   * @returns {Client|boolean} Cliente registrado ou true para compatibilidade com clientManager
   */
  registerClient(id, socket, type) {
    // Criar nova instância do modelo Client
    const client = new Client(id, socket, type);
    
    // Verificar se já existe uma lista para este ID
    if (!this.clientsMap.has(id)) {
      this.clientsMap.set(id, []);
      
      // Para compatibilidade com clientManager
      this._legacyClients[id] = [];
    }
    
    // Adicionar cliente à lista
    this.clientsMap.get(id).push(client);
    
    // Para compatibilidade com clientManager
    this._legacyClients[id].push(socket);
    
    console.log(`[REGISTER] ${type} registrado com ID: ${id}`);
    
    // Retornar o cliente para compatibilidade com o ClientService original
    // ou true para compatibilidade com clientManager
    return client;
  }

  /**
   * Remove um cliente com base no socket
   * @param {object} socket - Socket do cliente
   * @returns {string|null} ID do cliente removido ou null
   */
  removeClient(socket) {
    let removedClientId = null;
    
    // Percorrer todos os IDs de cliente
    for (const [id, clients] of this.clientsMap.entries()) {
      // Encontrar o índice do cliente com o socket correspondente
      const index = clients.findIndex(client => client.hasSocket(socket));
      
      if (index !== -1) {
        removedClientId = id;
        // Remover o cliente da lista
        clients.splice(index, 1);
        
        // Para compatibilidade com clientManager
        const legacyIndex = this._legacyClients[id].findIndex(s => s.id === socket.id);
        if (legacyIndex !== -1) {
          this._legacyClients[id].splice(legacyIndex, 1);
        }
        
        // Se não houver mais clientes com este ID, remover a entrada do mapa
        if (clients.length === 0) {
          this.clientsMap.delete(id);
          
          // Para compatibilidade com clientManager
          delete this._legacyClients[id];
        }
        
        break;
      }
    }
    
    return removedClientId;
  }

  /**
   * Envia uma mensagem para um ou mais clientes
   * @param {string|array} targetIds - ID ou array de IDs dos destinatários
   * @param {object} payload - Conteúdo da mensagem
   * @returns {number} Número de clientes que receberam a mensagem
   */
  sendMessage(targetIds, payload) {
    const targets = Array.isArray(targetIds) ? targetIds : [targetIds];
    let deliveredCount = 0;
    
    console.log(`[MENSAGEM] Tipo: ${payload.type}, Destino: ${targets.join(', ')}`);
    
    // Para cada ID de destino
    targets.forEach(targetId => {
      const clients = this.clientsMap.get(targetId);
      
      if (clients && clients.length > 0) {
        // Enviar mensagem para cada cliente com este ID
        clients.forEach(client => {
          const success = client.sendMessage(payload);
          if (success) deliveredCount++;
        });
      }
    });
    
    console.log(`[ENTREGA] Mensagem entregue para ${deliveredCount} cliente(s)`);
    return deliveredCount;
  }

  /**
   * Retorna o número total de clientes conectados
   * @returns {number} Número de clientes
   */
  getClientCount() {
    return Array.from(this.clientsMap.values()).reduce(
      (count, clients) => count + clients.length, 0
    );
  }

  /**
   * Retorna a lista de clientes conectados
   * @returns {object} Lista de clientes
   */
  getClients() {
    // Comportamento original do ClientService
    const result = {};
    
    for (const [id, clients] of this.clientsMap.entries()) {
      result[id] = clients.map(client => client.toJSON());
    }
    
    return result;
  }
  
  /**
   * Retorna a lista de clientes no formato legado (compatibilidade com clientManager)
   * @private
   * @returns {object} Lista de clientes no formato legado
   */
  _getLegacyClients() {
    return this._legacyClients;
  }

  /**
   * Retorna todos os clientes de um tipo específico
   * @param {string} type - Tipo de cliente (tv, painel, etc)
   * @returns {array} Lista de clientes do tipo especificado
   */
  getClientsByType(type) {
    const result = [];
    
    for (const clients of this.clientsMap.values()) {
      clients.forEach(client => {
        if (client.type === type) {
          result.push(client);
        }
      });
    }
    
    return result;
  }
  

}

// Criar uma instância única do serviço (Singleton)
const clientServiceInstance = new ClientService();

// Exportar a instância para compatibilidade com o ClientService original
module.exports = clientServiceInstance;

// Exportar métodos individuais para compatibilidade com o clientManager original
module.exports.registerClient = clientServiceInstance.registerClient.bind(clientServiceInstance);
module.exports.removeClient = clientServiceInstance.removeClient.bind(clientServiceInstance);
module.exports.sendMessage = clientServiceInstance.sendMessage.bind(clientServiceInstance);
module.exports.getClientCount = clientServiceInstance.getClientCount.bind(clientServiceInstance);
module.exports.getClients = clientServiceInstance.getClients.bind(clientServiceInstance);