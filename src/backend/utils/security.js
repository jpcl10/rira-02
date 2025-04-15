/**
 * Utilitários de segurança para a aplicação
 */

const config = require('../config/config');

/**
 * Configura os middlewares de segurança
 * @param {object} app - Aplicação Express
 */
function setupSecurityMiddleware(app) {
  // Configurações de segurança básicas
  app.use((req, res, next) => {
    const headers = config.security.headers;
    
    // Aplicar headers de segurança
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
    
    next();
  });
}

module.exports = {
  setupSecurityMiddleware
}; 