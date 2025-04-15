# RIRA 21 - Sistema de Comunicação Interna

Sistema minimalista de comunicação interna para consultórios e clínicas, com painel de controle e exibição em TVs.

## Funcionalidades

- **Sistema de Alertas**: Envie alertas e notificações para as TVs
- **Tarefas**: Gerencie e exiba listas de tarefas
- **Mídia**: Compartilhe imagens e vídeos nas TVs
- **Agenda**: Visualize a agenda do dia nos displays
- **QR Code**: Gere QR codes para compartilhar informações
- **Enquetes**: Crie e exiba enquetes com resultados em tempo real

## Estrutura do Projeto

```
rira-21/
├── docs/                    # Documentação
├── logs/                    # Arquivos de log
├── node_modules/            # Dependências
├── src/                     # Código-fonte
│   ├── backend/             # Código do servidor
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controladores
│   │   ├── models/          # Modelos
│   │   ├── routes/          # Rotas
│   │   ├── services/        # Serviços
│   │   ├── utils/           # Utilitários
│   │   └── server.js        # Arquivo principal
│   └── frontend/            # Interfaces
│       ├── painel/          # Painel de controle
│       └── tv/              # Interface para TVs
├── tests/                   # Testes
│   ├── integration/         # Testes de integração
│   └── unit/                # Testes unitários
├── package.json             # Configuração do projeto
└── README.md                # Documentação
```

## Requisitos

- Node.js 14.x ou superior
- npm 6.x ou superior

## Instalação

1. Clone o repositório:
```
git clone https://github.com/seuusuario/rira-21.git
cd rira-21
```

2. Instale as dependências:
```
npm install
```

## Execução

### Servidor de produção
```
npm start
```

### Desenvolvimento com recarga automática
```
npm run dev
```

### Testes
```
npm test            # Executa todos os testes
npm run test:tv     # Testa apenas o cliente TV
npm run test:painel # Testa apenas o painel de controle
```

## Acesso

Após iniciar o servidor, acesse:

- **Painel de Controle**: http://localhost:3001/painel
- **Interface da TV**: http://localhost:3001/tv
- **Status do Sistema**: http://localhost:3001/status

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: HTML5, TailwindCSS, JavaScript
- **Comunicação**: WebSockets em tempo real

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE). 