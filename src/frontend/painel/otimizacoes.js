/**
 * Otimizações de desempenho para o painel do RIRA 21
 * Este arquivo contém funções que melhoram a velocidade e responsividade do sistema
 */

// Função de debounce para evitar múltiplos envios acidentais
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Cache para armazenar mensagens recentes
const messageCache = {
  items: {},
  maxSize: 20,
  add(key, data) {
    // Limitar o tamanho do cache
    const keys = Object.keys(this.items);
    if (keys.length >= this.maxSize) {
      delete this.items[keys[0]];
    }
    this.items[key] = {
      data,
      timestamp: Date.now()
    };
  },
  get(key) {
    return this.items[key]?.data || null;
  },
  has(key) {
    return !!this.items[key];
  }
};

// Otimização da conexão WebSocket
function setupOptimizedSocket(url) {
  // Configurações otimizadas para Socket.io
  const socket = io(url, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket', 'polling']
  });
  
  // Monitoramento de latência
  let lastPingTime = 0;
  
  // Evento de conexão estabelecida
  socket.on('connect', () => {
    console.log('Conexão estabelecida com o servidor');
    // Registrar cliente após reconexão
    socket.emit("register", { type: "panel", id: "consultorio-1" });
    
    // Iniciar medição de latência
    pingServer();
  });
  
  // Evento de desconexão
  socket.on('disconnect', (reason) => {
    console.log(`Desconectado do servidor: ${reason}`);
  });
  
  // Evento de erro
  socket.on('connect_error', (error) => {
    console.error('Erro de conexão:', error);
  });
  
  // Função para medir latência
  function pingServer() {
    if (socket.connected) {
      lastPingTime = Date.now();
      socket.emit('ping');
    }
  }
  
  // Resposta do ping
  socket.on('pong', () => {
    const latency = Date.now() - lastPingTime;
    console.log(`Latência atual: ${latency}ms`);
    
    // Agendar próximo ping
    setTimeout(pingServer, 30000);
  });
  
  return socket;
}

// Função otimizada para envio de mensagens
function sendOptimizedMessage(socket, target, payload) {
  // Gerar chave única para o cache
  const cacheKey = `${target}-${payload.type}-${JSON.stringify(payload)}`;
  
  // Verificar se a mensagem já foi enviada recentemente (evitar duplicação)
  if (messageCache.has(cacheKey)) {
    const cachedTime = messageCache.get(cacheKey).timestamp;
    const timeDiff = Date.now() - cachedTime;
    
    // Se a mesma mensagem foi enviada nos últimos 2 segundos, ignorar
    if (timeDiff < 2000) {
      console.log('Mensagem duplicada ignorada');
      return false;
    }
  }
  
  // Comprimir payload removendo propriedades vazias
  const optimizedPayload = {};
  for (const key in payload) {
    if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
      optimizedPayload[key] = payload[key];
    }
  }
  
  // Registrar tempo de envio para medir performance
  const sendTime = Date.now();
  
  // Enviar mensagem
  socket.emit("send_message", { target, payload: optimizedPayload });
  
  // Adicionar ao cache
  messageCache.add(cacheKey, {
    target,
    payload: optimizedPayload,
    timestamp: sendTime
  });
  
  return true;
}

// Função para carregar recursos sob demanda (lazy loading)
function lazyLoadTab(tabId) {
  // Implementar carregamento sob demanda de recursos para cada aba
  const tabElement = document.getElementById(tabId);
  
  if (!tabElement) return;
  
  // Verificar se a aba já foi carregada
  if (tabElement.dataset.loaded === 'true') return;
  
  console.log(`Carregando recursos para a aba: ${tabId}`);
  
  // Marcar como carregada
  tabElement.dataset.loaded = 'true';
  
  // Aqui você pode carregar recursos específicos para cada aba
  // Por exemplo, carregar imagens, scripts ou dados
  switch (tabId) {
    case 'midiaTab':
      // Carregar previews de mídia
      break;
    case 'enqueteTab':
      // Carregar dados de enquetes anteriores
      break;
    // Adicionar outros casos conforme necessário
  }
}

// Aplicar otimizações quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Substituir a conexão socket padrão por uma otimizada
  const socketURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3001' 
    : window.location.origin;
  
  // Criar socket otimizado
  const optimizedSocket = setupOptimizedSocket(socketURL);
  
  // Substituir o socket global (se existir)
  if (window.socket) {
    // Desconectar o socket antigo
    window.socket.disconnect();
  }
  
  // Atribuir o novo socket otimizado
  window.socket = optimizedSocket;
  
  // Aplicar debounce nas funções de envio
  if (window.enviarAlerta) {
    window.enviarAlertaOriginal = window.enviarAlerta;
    window.enviarAlerta = debounce(window.enviarAlertaOriginal, 300);
  }
  
  if (window.enviarTarefas) {
    window.enviarTarefasOriginal = window.enviarTarefas;
    window.enviarTarefas = debounce(window.enviarTarefasOriginal, 300);
  }
  
  if (window.enviarAgenda) {
    window.enviarAgendaOriginal = window.enviarAgenda;
    window.enviarAgenda = debounce(window.enviarAgendaOriginal, 300);
  }
  
  if (window.enviarEnquete) {
    window.enviarEnqueteOriginal = window.enviarEnquete;
    window.enviarEnquete = debounce(window.enviarEnqueteOriginal, 300);
  }
  
  if (window.enviarQRCode) {
    window.enviarQRCodeOriginal = window.enviarQRCode;
    window.enviarQRCode = debounce(window.enviarQRCodeOriginal, 300);
  }
  
  if (window.enviarMidia) {
    window.enviarMidiaOriginal = window.enviarMidia;
    window.enviarMidia = debounce(window.enviarMidiaOriginal, 300);
  }
  
  if (window.agendarNotificacao) {
    window.agendarNotificacaoOriginal = window.agendarNotificacao;
    window.agendarNotificacao = debounce(window.agendarNotificacaoOriginal, 300);
  }
  
  // Otimizar a função showTab para implementar lazy loading
  if (window.showTab) {
    window.showTabOriginal = window.showTab;
    window.showTab = function(tabId) {
      // Chamar a função original
      window.showTabOriginal(tabId);
      
      // Implementar lazy loading
      lazyLoadTab(tabId);
    };
  }
  
  console.log('Otimizações de desempenho aplicadas com sucesso!');
});

// Exportar funções para uso global
window.sendOptimizedMessage = sendOptimizedMessage;
window.debounce = debounce;