/**
 * Serviço de gerenciamento de mensagens
 * Implementa a lógica de negócios relacionada às mensagens enviadas entre clientes
 */

const { Message } = require('../models');
const clientService = require('./ClientService');

class MessageService {
  constructor() {
    // Histórico de mensagens (opcional, para logging ou recuperação)
    this.messageHistory = [];
    // Limite do histórico de mensagens
    this.historyLimit = 100;
  }

  /**
   * Cria e envia uma nova mensagem
   * @param {string} type - Tipo da mensagem
   * @param {object} payload - Conteúdo da mensagem
   * @param {string|array} target - Destinatário(s) da mensagem
   * @param {string} sender - Remetente da mensagem
   * @returns {object} Resultado do envio {success, delivered, message}
   */
  sendMessage(type, payload, target, sender = null) {
    // Criar nova instância do modelo Message
    const message = new Message(type, payload, target, sender);
    
    // Adicionar ao histórico
    this._addToHistory(message);
    
    // Enviar para os destinatários usando o serviço de clientes
    const delivered = clientService.sendMessage(
      message.target,
      message.getFormattedPayload()
    );
    
    return {
      success: delivered > 0,
      delivered,
      message: message.toJSON()
    };
  }

  /**
   * Adiciona uma mensagem ao histórico
   * @param {Message} message - Mensagem a ser adicionada
   * @private
   */
  _addToHistory(message) {
    this.messageHistory.unshift(message.toJSON());
    
    // Limitar o tamanho do histórico
    if (this.messageHistory.length > this.historyLimit) {
      this.messageHistory = this.messageHistory.slice(0, this.historyLimit);
    }
  }

  /**
   * Retorna o histórico de mensagens
   * @param {number} limit - Limite de mensagens a retornar
   * @returns {array} Histórico de mensagens
   */
  getMessageHistory(limit = this.historyLimit) {
    return this.messageHistory.slice(0, limit);
  }

  /**
   * Limpa o histórico de mensagens
   */
  clearHistory() {
    this.messageHistory = [];
  }
}

// Exportar uma instância única do serviço (Singleton)
module.exports = new MessageService();