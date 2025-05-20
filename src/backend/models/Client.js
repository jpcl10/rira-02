/**
 * Modelo de Cliente
 * Representa um cliente conectado ao sistema (TV ou Painel)
 */

class Client {
  /**
   * Cria uma nova instância de Cliente
   * @param {string} id - Identificador único do cliente
   * @param {object} socket - Socket de conexão do cliente
   * @param {string} type - Tipo do cliente (tv, painel, etc)
   */
  constructor(id, socket, type) {
    this.id = id;
    this.socket = socket;
    this.type = type;
    this.connectedAt = new Date();
  }

  /**
   * Envia uma mensagem para o cliente
   * @param {object} payload - Conteúdo da mensagem
   * @returns {boolean} Sucesso do envio
   */
  sendMessage(payload) {
    try {
      this.socket.emit("message", payload);
      return true;
    } catch (error) {
      console.error(`Erro ao enviar mensagem para cliente ${this.id}:`, error);
      return false;
    }
  }

  /**
   * Verifica se o socket corresponde a este cliente
   * @param {object} socket - Socket a verificar
   * @returns {boolean} Verdadeiro se o socket corresponder
   */
  hasSocket(socket) {
    return this.socket.id === socket.id;
  }

  /**
   * Retorna informações básicas do cliente (sem o socket)
   * @returns {object} Informações do cliente
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      socketId: this.socket.id,
      connectedAt: this.connectedAt
    };
  }
}

module.exports = Client;