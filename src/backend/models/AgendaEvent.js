/**
 * Modelo de Evento de Agenda
 * Representa um evento a ser exibido na agenda da TV
 */

class AgendaEvent {
  /**
   * Cria uma nova instância de Evento de Agenda
   * @param {string} time - Horário do evento (formato HH:MM)
   * @param {string} title - Título do evento
   * @param {string} description - Descrição do evento
   * @param {string} createdBy - ID do cliente que criou o evento
   */
  constructor(time, title, description = '', createdBy = null) {
    this.id = this._generateId();
    this.time = time;
    this.title = title;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Gera um ID único para o evento
   * @returns {string} ID único
   * @private
   */
  _generateId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Atualiza as informações do evento
   * @param {object} data - Dados a serem atualizados
   */
  update(data) {
    if (data.time) this.time = data.time;
    if (data.title) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    this.updatedAt = new Date();
  }

  /**
   * Converte o evento para um objeto JSON
   * @returns {object} Representação JSON do evento
   */
  toJSON() {
    return {
      id: this.id,
      time: this.time,
      title: this.title,
      description: this.description,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Compara este evento com outro para ordenação por horário
   * @param {AgendaEvent} otherEvent - Evento a ser comparado
   * @returns {number} Resultado da comparação (-1, 0, 1)
   */
  compareTo(otherEvent) {
    return this.time.localeCompare(otherEvent.time);
  }
}

module.exports = AgendaEvent;