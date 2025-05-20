/**
 * Índice de modelos do sistema
 * Centraliza a exportação de todos os modelos para facilitar importações
 */

const Client = require('./Client');
const Message = require('./Message');
const Task = require('./Task');
const AgendaEvent = require('./AgendaEvent');
const Poll = require('./Poll');
const Media = require('./Media');

module.exports = {
  Client,
  Message,
  Task,
  AgendaEvent,
  Poll,
  Media
};