/**
 * Controlador para endpoints de status
 */

const clientManager = require('../services/clientManager');

/**
 * Retorna o status atual do sistema
 * @param {object} req - Requisição Express
 * @param {object} res - Resposta Express
 */
function getStatus(req, res) {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connections: clientManager.getClientCount()
  });
}

module.exports = {
  getStatus
}; 