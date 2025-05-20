/**
 * Modelo de Mensagem
 * Representa uma mensagem enviada entre clientes do sistema
 */

class Message {
  /**
   * Cria uma nova instância de Mensagem
   * @param {string} type - Tipo da mensagem (alert, task, media, etc)
   * @param {object} payload - Conteúdo da mensagem
   * @param {string|array} target - Destinatário(s) da mensagem
   * @param {string} sender - Remetente da mensagem
   */
  constructor(type, payload, target, sender = null) {
    this.type = type;
    this.payload = payload;
    this.target = Array.isArray(target) ? target : [target];
    this.sender = sender;
    this.timestamp = new Date();
  }

  /**
   * Verifica se um cliente específico é destinatário desta mensagem
   * @param {string} clientId - ID do cliente a verificar
   * @returns {boolean} Verdadeiro se o cliente for destinatário
   */
  isTargetedTo(clientId) {
    return this.target.includes(clientId) || this.target.includes('all');
  }

  /**
   * Retorna o payload da mensagem pronto para envio
   * @returns {object} Payload formatado
   */
  getFormattedPayload() {
    return {
      ...this.payload,
      _meta: {
        type: this.type,
        timestamp: this.timestamp.toISOString(),
        sender: this.sender
      }
    };
  }

  /**
   * Converte a mensagem para um objeto JSON
   * @returns {object} Representação JSON da mensagem
   */
  toJSON() {
    return {
      type: this.type,
      payload: this.payload,
      target: this.target,
      sender: this.sender,
      timestamp: this.timestamp
    };
  }
}

module.exports = Message;