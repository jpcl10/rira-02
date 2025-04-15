/**
 * Arquivo de configuração do sistema RIRA 21
 * Contém todas as configurações centralizadas
 */

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3001,
    isReplit: Boolean(process.env.REPL_ID || process.env.REPL_SLUG),
  },
  
  // Configurações de segurança
  security: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block'
    },
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  },
  
  // Configurações de caminho
  paths: {
    frontend: '../frontend',
    index: '../../index.html'
  },
  
  // Configurações do sistema
  system: {
    name: 'RIRA 21',
    version: '1.0.0',
    description: 'Sistema de Comunicação Interna para Consultórios e Clínicas'
  }
};

module.exports = config; 