/**
 * Modelo de Enquete
 * Representa uma enquete a ser exibida na TV
 */

class Poll {
  /**
   * Cria uma nova instância de Enquete
   * @param {string} question - Pergunta da enquete
   * @param {array} options - Opções de resposta
   * @param {string} createdBy - ID do cliente que criou a enquete
   */
  constructor(question, options = [], createdBy = null) {
    this.id = this._generateId();
    this.question = question;
    this.options = options.map(opt => {
      return {
        id: this._generateOptionId(),
        text: opt.text || opt,
        votes: opt.votes || 0
      };
    });
    this.createdBy = createdBy;
    this.active = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Gera um ID único para a enquete
   * @returns {string} ID único
   * @private
   */
  _generateId() {
    return `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gera um ID único para uma opção
   * @returns {string} ID único
   * @private
   */
  _generateOptionId() {
    return `option_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  /**
   * Adiciona uma nova opção à enquete
   * @param {string} text - Texto da opção
   * @returns {object} A opção adicionada
   */
  addOption(text) {
    const option = {
      id: this._generateOptionId(),
      text,
      votes: 0
    };
    this.options.push(option);
    this.updatedAt = new Date();
    return option;
  }

  /**
   * Remove uma opção da enquete
   * @param {string} optionId - ID da opção a remover
   * @returns {boolean} Sucesso da operação
   */
  removeOption(optionId) {
    const initialLength = this.options.length;
    this.options = this.options.filter(opt => opt.id !== optionId);
    const removed = initialLength > this.options.length;
    
    if (removed) {
      this.updatedAt = new Date();
    }
    
    return removed;
  }

  /**
   * Registra um voto em uma opção
   * @param {string} optionId - ID da opção votada
   * @returns {boolean} Sucesso da operação
   */
  vote(optionId) {
    const option = this.options.find(opt => opt.id === optionId);
    if (option && this.active) {
      option.votes += 1;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * Ativa a enquete
   */
  activate() {
    this.active = true;
    this.updatedAt = new Date();
  }

  /**
   * Desativa a enquete
   */
  deactivate() {
    this.active = false;
    this.updatedAt = new Date();
  }

  /**
   * Retorna o total de votos na enquete
   * @returns {number} Total de votos
   */
  getTotalVotes() {
    return this.options.reduce((sum, option) => sum + option.votes, 0);
  }

  /**
   * Converte a enquete para um objeto JSON
   * @returns {object} Representação JSON da enquete
   */
  toJSON() {
    return {
      id: this.id,
      question: this.question,
      options: this.options,
      active: this.active,
      totalVotes: this.getTotalVotes(),
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Poll;