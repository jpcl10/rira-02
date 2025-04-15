# Guia de Implantação do RIRA 21 em VPS

Este guia fornece instruções passo a passo para implantar o sistema RIRA 21 em um servidor VPS (Virtual Private Server).

## Pré-requisitos

- Uma VPS com sistema operacional Linux (Ubuntu/Debian recomendado)
- Acesso SSH ao servidor
- Domínio configurado para apontar para o IP da VPS (opcional, mas recomendado)
- Conhecimentos básicos de linha de comando Linux

## 1. Preparação do Servidor

### Atualizar o sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### Instalar o Node.js e npm

```bash
# Adicionar repositório Node.js
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -

# Instalar Node.js e npm
sudo apt install -y nodejs

# Verificar a instalação
node -v  # Deve mostrar v14.x ou superior
npm -v   # Deve mostrar v6.x ou superior
```

### Instalar o Git (opcional, se for clonar o repositório)

```bash
sudo apt install -y git
```

## 2. Transferir os Arquivos para a VPS

Escolha um dos métodos abaixo:

### Opção 1: Usando SCP (do seu computador local)

```bash
# Criar um pacote do projeto
npm run package

# Transferir o arquivo para a VPS
scp rira-21-v1.0.0.tar.gz usuario@seu-servidor:/caminho/destino/
```

### Opção 2: Usando Git (se o código estiver em um repositório)

```bash
# Na VPS
git clone https://seu-repositorio/rira-21.git /caminho/destino/rira-21
```

## 3. Configuração do Projeto

### Descompactar o arquivo (se usou SCP)

```bash
# Na VPS
cd /caminho/destino/
tar -xzf rira-21-v1.0.0.tar.gz
cd rira-21-v1.0.0/
```

### Instalar dependências

```bash
npm install --production
```

### Configurar a porta (opcional)

Se necessário, edite o arquivo `src/backend/config/config.js` para alterar a porta padrão (3001):

```javascript
server: {
  port: process.env.PORT || 3001,  // Altere para a porta desejada
  isReplit: Boolean(process.env.REPL_ID || process.env.REPL_SLUG),
},
```

## 4. Configurar o PM2 (Process Manager)

PM2 é um gerenciador de processos que manterá sua aplicação rodando continuamente.

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar a aplicação com PM2
pm2 start src/backend/production-server.js --name "rira-21"

# Configurar para iniciar automaticamente após reinicialização do servidor
pm2 startup
# Execute o comando sugerido pelo PM2

# Salvar a configuração atual do PM2
pm2 save
```

## 5. Configurar o Nginx como Proxy Reverso

Nginx atuará como um proxy reverso, encaminhando as requisições para o Node.js.

```bash
# Instalar Nginx
sudo apt install -y nginx

# Configurar o firewall (se estiver ativo)
sudo ufw allow 'Nginx Full'
```

Crie um arquivo de configuração para o Nginx:

```bash
sudo nano /etc/nginx/sites-available/rira-21
```

Adicione o seguinte conteúdo (substitua `seudominio.com` pelo seu domínio):

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:3001;  # Use a porta configurada no seu app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative a configuração e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/rira-21 /etc/nginx/sites-enabled/
sudo nginx -t  # Testar a configuração
sudo systemctl restart nginx
```

## 6. Configurar HTTPS com Certbot (opcional, mas recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Seguir as instruções na tela
# Certbot atualizará automaticamente a configuração do Nginx
```

## 7. Verificar a Implantação

Agora você pode acessar o sistema RIRA 21 através do seu navegador:

- TV: `https://seudominio.com/tv`
- Painel: `https://seudominio.com/painel`
- Status: `https://seudominio.com/status`

## 8. Manutenção e Monitoramento

### Verificar logs

```bash
pm2 logs rira-21
```

### Reiniciar a aplicação

```bash
pm2 restart rira-21
```

### Atualizar o sistema

Para atualizar o sistema com uma nova versão:

1. Transfira os novos arquivos para a VPS
2. Instale as dependências: `npm install --production`
3. Reinicie a aplicação: `pm2 restart rira-21`

## Solução de Problemas

### Verificar status do serviço

```bash
pm2 status
nginx -t
sudo systemctl status nginx
```

### Verificar portas em uso

```bash
sudo netstat -tulpn | grep LISTEN
```

### Verificar logs do Nginx

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

Este guia cobre os passos básicos para implantar o sistema RIRA 21 em uma VPS. Dependendo das necessidades específicas e da configuração do servidor, alguns ajustes podem ser necessários.