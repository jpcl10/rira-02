/**
 * Testes unitários para o serviço de gerenciamento de clientes
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
const ClientService = require('../../src/backend/services/ClientService');

describe('ClientService', () => {
  // Limpar o mapa de clientes antes de cada teste
  beforeEach(() => {
    // Resetar o mapa de clientes para um estado limpo
    ClientService.clientsMap.clear();
  });

  describe('#registerClient', () => {
    it('deve registrar um novo cliente corretamente', () => {
      const socket = new MockSocket('socket1');
      const client = ClientService.registerClient('client1', socket, 'tv');
      
      assert.strictEqual(client.id, 'client1');
      assert.strictEqual(client.type, 'tv');
      assert.strictEqual(client.socket, socket);
      assert.strictEqual(ClientService.clientsMap.get('client1').length, 1);
    });

    it('deve permitir múltiplos clientes com o mesmo ID', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      ClientService.registerClient('client1', socket1, 'tv');
      ClientService.registerClient('client1', socket2, 'painel');
      
      assert.strictEqual(ClientService.clientsMap.get('client1').length, 2);
    });
  });

  describe('#removeClient', () => {
    it('deve remover um cliente existente', () => {
      const socket = new MockSocket('socket1');
      ClientService.registerClient('client1', socket, 'tv');
      
      const removedId = ClientService.removeClient(socket);
      
      assert.strictEqual(removedId, 'client1');
      assert.strictEqual(ClientService.clientsMap.has('client1'), false);
    });

    it('deve retornar null ao tentar remover um cliente inexistente', () => {
      const socket = new MockSocket('socket1');
      
      const removedId = ClientService.removeClient(socket);
      
      assert.strictEqual(removedId, null);
    });

    it('deve manter outros clientes com o mesmo ID ao remover um cliente', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      ClientService.registerClient('client1', socket1, 'tv');
      ClientService.registerClient('client1', socket2, 'painel');
      
      ClientService.removeClient(socket1);
      
      assert.strictEqual(ClientService.clientsMap.get('client1').length, 1);
    });
  });

  describe('#sendMessage', () => {
    it('deve enviar mensagem para um cliente específico', () => {
      const socket = new MockSocket('socket1');
      ClientService.registerClient('client1', socket, 'tv');
      
      const delivered = ClientService.sendMessage('client1', { type: 'test', data: 'test data' });
      
      assert.strictEqual(delivered, 1);
    });

    it('deve enviar mensagem para múltiplos clientes', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      ClientService.registerClient('client1', socket1, 'tv');
      ClientService.registerClient('client2', socket2, 'painel');
      
      const delivered = ClientService.sendMessage(['client1', 'client2'], { type: 'test', data: 'test data' });
      
      assert.strictEqual(delivered, 2);
    });

    it('deve retornar 0 ao tentar enviar mensagem para um cliente inexistente', () => {
      const delivered = ClientService.sendMessage('nonexistent', { type: 'test', data: 'test data' });
      
      assert.strictEqual(delivered, 0);
    });
  });

  describe('#getClientCount', () => {
    it('deve retornar o número correto de clientes', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      ClientService.registerClient('client1', socket1, 'tv');
      ClientService.registerClient('client2', socket2, 'painel');
      
      assert.strictEqual(ClientService.getClientCount(), 2);
    });
  });

  describe('#getClients', () => {
    it('deve retornar a lista de clientes no formato correto', () => {
      const socket = new MockSocket('socket1');
      ClientService.registerClient('client1', socket, 'tv');
      
      const clients = ClientService.getClients();
      
      assert.strictEqual(typeof clients, 'object');
      assert.strictEqual(Array.isArray(clients.client1), true);
      assert.strictEqual(clients.client1[0].id, 'client1');
      assert.strictEqual(clients.client1[0].type, 'tv');
    });
  });

  describe('#getClientsByType', () => {
    it('deve retornar clientes filtrados por tipo', () => {
      const socket1 = new MockSocket('socket1');
      const socket2 = new MockSocket('socket2');
      
      ClientService.registerClient('client1', socket1, 'tv');
      ClientService.registerClient('client2', socket2, 'painel');
      
      const tvClients = ClientService.getClientsByType('tv');
      
      assert.strictEqual(tvClients.length, 1);
      assert.strictEqual(tvClients[0].type, 'tv');
    });
  });
});