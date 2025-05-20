/**
 * Testes unitários para o serviço de gerenciamento de clientes WebSocket
 */

const assert = require('assert');
const { EventEmitter } = require('events');

// Mock para o socket
class MockSocket extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
  }

  emit(event, data) {
    return true;
  }
}

// Importar o serviço a ser testado
const clientManager = require('../../src/backend/services/clientManager');

describe('clientManager', () => {
  // Limpar o objeto de clientes antes de cada teste
  beforeEach(() => {
    // Resetar o objeto de clientes para um estado limpo
    // Como o clientManager usa um objeto simples, precisamos limpar manualmente
    Object.keys(clientManager.getClients()).forEach(key => {
      delete clientManager.getClients()[key];
    });
  });

  describe('#registerClient', () => {
    it('deve registrar um novo cliente corretamente', () => {
      const socket = new MockSocket('socket1');
      const result = clientManager.registerClient('client1', socket, 'tv');
      
      assert.strictEqual(result, true);
      assert.strictEqual(clientManager.getClients()['client1'].length, 1);
    });

    it('deve permitir múltiplos clientes com o mesmo ID', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      clientManager.registerClient('client1', socket1, 'tv');
      clientManager.registerClient('client1', socket2, 'painel');
      
      assert.strictEqual(clientManager.getClients()['client1'].length, 2);
    });
  });

  describe('#removeClient', () => {
    it('deve remover um cliente existente', () => {
      const socket = new MockSocket('socket1');
      clientManager.registerClient('client1', socket, 'tv');
      
      const removedId = clientManager.removeClient(socket);
      
      assert.strictEqual(removedId, 'client1');
      assert.strictEqual(clientManager.getClients()['client1'], undefined);
    });

    it('deve retornar null ao tentar remover um cliente inexistente', () => {
      const socket = new MockSocket('socket1');
      
      const removedId = clientManager.removeClient(socket);
      
      assert.strictEqual(removedId, null);
    });

    it('deve manter outros clientes com o mesmo ID ao remover um cliente', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      clientManager.registerClient('client1', socket1, 'tv');
      clientManager.registerClient('client1', socket2, 'painel');
      
      clientManager.removeClient(socket1);
      
      assert.strictEqual(clientManager.getClients()['client1'].length, 1);
    });
  });

  describe('#sendMessage', () => {
    it('deve enviar mensagem para um cliente específico', () => {
      const socket = new MockSocket('socket1');
      clientManager.registerClient('client1', socket, 'tv');
      
      const delivered = clientManager.sendMessage('client1', { type: 'test', data: 'test data' });
      
      assert.strictEqual(delivered, 1);
    });

    it('deve enviar mensagem para múltiplos clientes', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      clientManager.registerClient('client1', socket1, 'tv');
      clientManager.registerClient('client2', socket2, 'painel');
      
      const delivered = clientManager.sendMessage(['client1', 'client2'], { type: 'test', data: 'test data' });
      
      assert.strictEqual(delivered, 2);
    });

    it('deve retornar 0 ao tentar enviar mensagem para um cliente inexistente', () => {
      const delivered = clientManager.sendMessage('nonexistent', { type: 'test', data: 'test data' });
      
      assert.strictEqual(delivered, 0);
    });
  });

  describe('#getClientCount', () => {
    it('deve retornar o número correto de clientes', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      clientManager.registerClient('client1', socket1, 'tv');
      clientManager.registerClient('client2', socket2, 'painel');
      
      assert.strictEqual(clientManager.getClientCount(), 2);
    });
  });

  describe('#getClients', () => {
    it('deve retornar a lista de clientes no formato correto', () => {
      const socket = new MockSocket('socket1');
      clientManager.registerClient('client1', socket, 'tv');
      
      const clients = clientManager.getClients();
      
      assert.strictEqual(typeof clients, 'object');
      assert.strictEqual(Array.isArray(clients.client1), true);
      assert.strictEqual(clients.client1[0].id, 'socket1');
    });
  });
});