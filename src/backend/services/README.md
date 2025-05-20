# Serviços do Sistema RIRA 21

## Refatoração dos Serviços de Cliente

O sistema RIRA 21 passou por uma refatoração para consolidar os serviços de gerenciamento de clientes. Anteriormente, existiam dois serviços separados (`ClientService.js` e `clientManager.js`) com funcionalidades semelhantes, o que gerava duplicação de código e dificultava a manutenção.

### Mudanças Realizadas

1. **Consolidação de Serviços**: Todas as funcionalidades de gerenciamento de clientes foram consolidadas no `ClientService.js`.

2. **Compatibilidade com Código Existente**: O arquivo `clientManager.js` foi mantido para compatibilidade com o código existente, mas agora ele apenas redireciona as chamadas para o `ClientService`.

3. **Padrão Singleton**: O `ClientService` continua implementando o padrão Singleton, garantindo que exista apenas uma instância do serviço em toda a aplicação.

### Como Usar

#### Para Novos Desenvolvimentos

Para novos desenvolvimentos, utilize diretamente o `ClientService`:

```javascript
const clientService = require('./services/ClientService');

// Registrar um cliente
const client = clientService.registerClient(id, socket, type);

// Enviar mensagem para clientes
const delivered = clientService.sendMessage(targetIds, payload);

// Obter lista de clientes
const clients = clientService.getClients();
```

#### Métodos Disponíveis

- `registerClient(id, socket, type)`: Registra um novo cliente
- `removeClient(socket)`: Remove um cliente com base no socket
- `sendMessage(targetIds, payload)`: Envia uma mensagem para um ou mais clientes
- `getClientCount()`: Retorna o número total de clientes conectados
- `getClients()`: Retorna a lista de clientes conectados
- `getClientsByType(type)`: Retorna todos os clientes de um tipo específico

### Código Legado

O arquivo `clientManager.js` foi mantido para compatibilidade com o código existente. No entanto, recomenda-se migrar gradualmente para o uso direto do `ClientService` em novos desenvolvimentos.

```javascript
// Código legado (ainda funciona, mas não recomendado para novos desenvolvimentos)
const clientManager = require('./services/clientManager');

// Recomendado para novos desenvolvimentos
const clientService = require('./services/ClientService');
```

### Testes

Foram implementados testes unitários para garantir que a refatoração não quebre a funcionalidade existente. Os testes podem ser encontrados em `tests/unit/ClientService.test.js`.