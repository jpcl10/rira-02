/**
 * Modelo de Tarefa
 * Representa uma tarefa a ser exibida na TV
 */

class Task {
  /**
   * Cria uma nova instância de Tarefa
   * @param {string} description - Descrição da tarefa
   * @param {string} createdBy - ID do cliente que criou a tarefa
   * @param {boolean} completed - Estado de conclusão da tarefa
   */
  constructor(description, createdBy = null, completed = false) {
    this.id = this._generateId();
    this.description = description;
    this.createdBy = createdBy;
    this.completed = completed;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Gera um ID único para a tarefa
   * @returns {string} ID único
   * @private
   */
  _generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Marca a tarefa como concluída
   */
  complete() {
    this.completed = true;
    this.updatedAt = new Date();
  }

  /**
   * Marca a tarefa como não concluída
   */
  uncomplete() {
    this.completed = false;
    this.updatedAt = new Date();
  }

  /**
   * Atualiza a descrição da tarefa
   * @param {string} description - Nova descrição
   */
  updateDescription(description) {
    this.description = description;
    this.updatedAt = new Date();
  }

  /**
   * Converte a tarefa para um objeto JSON
   * @returns {object} Representação JSON da tarefa
   */
  toJSON() {
    return {
      id: this.id,
      description: this.description,
      completed: this.completed,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Task;