/**
 * Serviço de gerenciamento de clientes WebSocket
 * 
 * AVISO: Este arquivo está mantido apenas para compatibilidade com código existente.
 * Todas as funcionalidades foram consolidadas no ClientService.js.
 * Para novos desenvolvimentos, utilize diretamente o ClientService.
 */

// Importar o serviço ClientService consolidado
const clientService = require('./ClientService');

// Exportar os métodos do ClientService para manter compatibilidade
module.exports = {
  registerClient: clientService.registerClient,
  removeClient: clientService.removeClient,
  sendMessage: clientService.sendMessage,
  getClientCount: clientService.getClientCount,
  getClients: clientService._getLegacyClients.bind(clientService)
};