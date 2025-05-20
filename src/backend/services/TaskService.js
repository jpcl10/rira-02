/**
 * Serviço de gerenciamento de tarefas
 * Implementa a lógica de negócios relacionada às tarefas exibidas na TV
 */

const { Task } = require('../models');
const messageService = require('./MessageService');

class TaskService {
  constructor() {
    // Lista de tarefas ativas
    this.tasks = [];
  }

  /**
   * Adiciona uma nova tarefa
   * @param {string} description - Descrição da tarefa
   * @param {string} createdBy - ID do cliente que criou a tarefa
   * @returns {Task} Tarefa criada
   */
  addTask(description, createdBy = null) {
    const task = new Task(description, createdBy);
    this.tasks.push(task);
    return task;
  }

  /**
   * Remove uma tarefa pelo ID
   * @param {string} taskId - ID da tarefa a remover
   * @returns {boolean} Sucesso da operação
   */
  removeTask(taskId) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    return initialLength > this.tasks.length;
  }

  /**
   * Atualiza o estado de uma tarefa
   * @param {string} taskId - ID da tarefa
   * @param {object} updates - Atualizações a serem aplicadas
   * @returns {Task|null} Tarefa atualizada ou null se não encontrada
   */
  updateTask(taskId, updates) {
    const task = this.tasks.find(task => task.id === taskId);
    
    if (!task) return null;
    
    if (updates.description) {
      task.updateDescription(updates.description);
    }
    
    if (updates.completed !== undefined) {
      updates.completed ? task.complete() : task.uncomplete();
    }
    
    return task;
  }

  /**
   * Retorna todas as tarefas
   * @returns {array} Lista de tarefas
   */
  getAllTasks() {
    return this.tasks.map(task => task.toJSON());
  }

  /**
   * Retorna uma tarefa pelo ID
   * @param {string} taskId - ID da tarefa
   * @returns {Task|null} Tarefa encontrada ou null
   */
  getTaskById(taskId) {
    const task = this.tasks.find(task => task.id === taskId);
    return task || null;
  }

  /**
   * Atualiza as tarefas na TV
   * @param {string|array} target - ID ou array de IDs dos destinatários
   * @returns {object} Resultado do envio
   */
  broadcastTasks(target) {
    const payload = {
      type: "tasks",
      tasks: this.getAllTasks()
    };
    
    return messageService.sendMessage("tasks", payload, target);
  }

  /**
   * Define a lista completa de tarefas
   * @param {array} taskDescriptions - Lista de descrições de tarefas
   * @param {string} createdBy - ID do cliente que criou as tarefas
   * @returns {array} Lista de tarefas criadas
   */
  setTasks(taskDescriptions, createdBy = null) {
    // Limpar tarefas existentes
    this.tasks = [];
    
    // Adicionar novas tarefas
    const newTasks = taskDescriptions.map(description => 
      this.addTask(description, createdBy)
    );
    
    return newTasks;
  }
}

// Exportar uma instância única do serviço (Singleton)
module.exports = new TaskService();