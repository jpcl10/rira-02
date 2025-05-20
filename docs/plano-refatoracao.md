# Plano de Refatoração do Sistema RIRA 21

Este documento apresenta um plano detalhado para melhorar a organização do código do Sistema RIRA 21, aplicando os princípios SOLID e as boas práticas de engenharia de software mencionadas na documentação.

## 1. Análise da Estrutura Atual

### 1.1 Pontos Positivos
- Já existe uma separação básica entre frontend e backend
- Há uma estrutura inicial de diretórios para controllers, routes, services e models
- Configurações centralizadas em um arquivo config.js
- Separação de responsabilidades entre alguns componentes

### 1.2 Oportunidades de Melhoria
- Diretório de models está vazio, indicando falta de modelagem de dados
- Lógica de negócios misturada com código de infraestrutura
- Duplicação de código entre server.js e production-server.js
- Falta de interfaces claras entre componentes
- Código JavaScript no HTML do frontend
- Ausência de testes unitários para componentes individuais

## 2. Princípios SOLID a Aplicar

### 2.1 Princípio da Responsabilidade Única (S)
- Cada módulo deve ter uma única razão para mudar
- Separar claramente as responsabilidades entre controladores, serviços e modelos

### 2.2 Princípio Aberto/Fechado (O)
- Componentes devem ser extensíveis sem modificar código existente
- Implementar interfaces para permitir extensões futuras

### 2.3 Princípio da Substituição de Liskov (L)
- Garantir que interfaces sejam consistentes entre componentes
- Implementações devem ser substituíveis sem afetar o comportamento do sistema

### 2.4 Princípio da Segregação de Interface (I)
- Criar interfaces específicas para diferentes clientes
- Evitar interfaces genéricas que forçam implementações desnecessárias

### 2.5 Princípio da Inversão de Dependência (D)
- Depender de abstrações, não de implementações concretas
- Implementar injeção de dependências para facilitar testes e manutenção

## 3. Plano de Refatoração do Backend

### 3.1 Reorganização de Diretórios
```
src/
  backend/
    config/           # Configurações do sistema
    controllers/      # Controladores de rotas e WebSocket
    middlewares/      # Middlewares Express
    models/           # Modelos de dados
    repositories/     # Acesso a dados persistentes
    routes/           # Definições de rotas
    services/         # Lógica de negócios
    utils/            # Utilitários
    app.js            # Configuração da aplicação Express
    server.js         # Inicialização do servidor HTTP
```

### 3.2 Implementação de Modelos
- Criar modelos para representar entidades do sistema:
  - Cliente (TV, Painel)
  - Mensagem
  - Tarefa
  - Evento de Agenda
  - Enquete

### 3.3 Refatoração de Serviços
- Separar o clientManager em serviços específicos:
  - ClientService: gerenciamento de clientes
  - MessageService: envio e recebimento de mensagens
  - TaskService: gerenciamento de tarefas
  - AgendaService: gerenciamento de eventos da agenda
  - PollService: gerenciamento de enquetes

### 3.4 Refatoração de Controladores
- Separar o socketController em controladores específicos:
  - ClientController: registro e desconexão de clientes
  - MessageController: processamento de mensagens
  - TaskController: gerenciamento de tarefas
  - AgendaController: gerenciamento de eventos da agenda
  - PollController: gerenciamento de enquetes

### 3.5 Implementação de Injeção de Dependências
- Criar um sistema simples de injeção de dependências
- Passar dependências através de construtores ou parâmetros de função

### 3.6 Unificação dos Servidores
- Consolidar server.js e production-server.js em um único arquivo
- Usar variáveis de ambiente para configurar o modo de execução

## 4. Plano de Refatoração do Frontend

### 4.1 Reorganização de Diretórios
```
src/
  frontend/
    common/           # Componentes e utilitários compartilhados
      js/             # JavaScript compartilhado
      css/            # Estilos compartilhados
    painel/           # Interface do painel de controle
      js/             # JavaScript específico do painel
      css/            # Estilos específicos do painel
      index.html      # Página principal do painel
    tv/               # Interface da TV
      js/             # JavaScript específico da TV
      css/            # Estilos específicos da TV
      index.html      # Página principal da TV
```

### 4.2 Separação de JavaScript do HTML
- Extrair código JavaScript embutido para arquivos .js separados
- Organizar código por funcionalidade

### 4.3 Implementação de Módulos JavaScript
- Usar módulos ES6 para organizar o código
- Separar código por responsabilidade:
  - api.js: comunicação com o backend
  - ui.js: manipulação da interface
  - models.js: modelos de dados
  - controllers.js: lógica de controle

## 5. Implementação de Testes

### 5.1 Testes Unitários
- Implementar testes para serviços e controladores
- Usar mocks para isolar componentes durante os testes

### 5.2 Testes de Integração
- Testar a integração entre componentes
- Verificar o fluxo completo de funcionalidades

## 6. Cronograma de Implementação

### Fase 1: Reorganização de Diretórios e Refatoração Básica
- Reorganizar estrutura de diretórios
- Implementar modelos básicos
- Separar JavaScript do HTML no frontend

### Fase 2: Implementação de Serviços e Controladores
- Refatorar serviços existentes
- Implementar novos controladores
- Aplicar injeção de dependências

### Fase 3: Unificação e Otimização
- Consolidar servidores
- Implementar testes
- Otimizar desempenho

## 7. Benefícios Esperados

- **Manutenibilidade**: Código mais fácil de entender e modificar
- **Testabilidade**: Componentes isolados facilitam testes unitários
- **Extensibilidade**: Novas funcionalidades podem ser adicionadas sem modificar código existente
- **Reutilização**: Componentes bem definidos podem ser reutilizados em diferentes partes do sistema
- **Desempenho**: Código mais organizado facilita otimizações específicas

## 8. Recomendações Adicionais

- Implementar um sistema de logging estruturado
- Adicionar validação de dados de entrada
- Implementar tratamento de erros consistente
- Documentar APIs e interfaces
- Considerar o uso de TypeScript para tipagem estática