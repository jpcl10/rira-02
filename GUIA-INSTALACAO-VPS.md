# Guia de Instalação do RIRA 21 em VPS

Este guia fornece instruções passo a passo para configurar o sistema RIRA 21 em uma VPS após clonar o repositório via EasyPanel.

## Requisitos

- Node.js (versão 14 ou superior)
- NPM (versão 6 ou superior)
- PM2 (para gerenciamento de processos)
- Nginx (opcional, para proxy reverso)

## Passos para Instalação

### 1. Acessar o diretório do projeto

```bash
cd /caminho/para/seu/repositorio/clonado
```

### 2. Instalar dependências

Para ambiente de produção, use o comando:

```bash
npm install --production
```

Ou simplesmente:

```bash
npm install
```

### 3. Configurar variáveis de ambiente (opcional)

Se necessário, configure a porta do servidor criando um arquivo `.env` na raiz do projeto:

```bash
echo "PORT=3001" > .env
```

### 4. Iniciar o servidor em modo de produção

Você pode iniciar o servidor diretamente:

```bash
npm start
```

Ou usar o script de produção otimizado:

```bash
npm run prod:start
```

### 5. Configurar PM2 para manter o aplicativo rodando

Instalar PM2 globalmente (se ainda não estiver instalado):

```bash
npm install -g pm2
```

Iniciar o aplicativo com PM2:

```bash
pm2 start src/backend/production-server.js --name "rira21"
```

Configurar para iniciar automaticamente após reinicialização do servidor:

```bash
pm2 startup
# Execute o comando sugerido pelo PM2
pm2 save
```

### 6. Configurar Nginx como proxy reverso (opcional, mas recomendado)

Instalar Nginx (se ainda não estiver instalado):

```bash
# Para Ubuntu/Debian
sudo apt update
sudo apt install nginx

# Para CentOS/RHEL
sudo yum install nginx
```

Criar configuração do Nginx:

```bash
sudo nano /etc/nginx/sites-available/rira21
```

Adicionar a seguinte configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar a configuração:

```bash
# Para Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/rira21 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Para CentOS/RHEL
sudo ln -s /etc/nginx/sites-available/rira21 /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Configurar HTTPS com Certbot (opcional, mas recomendado)

Instalar Certbot:

```bash
# Para Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# Para CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

Obter certificado SSL:

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## Verificação da Instalação

Após a instalação, você pode acessar o sistema através dos seguintes URLs:

- TV: http://seu-dominio.com/tv
- Painel: http://seu-dominio.com/painel
- Status: http://seu-dominio.com/status

## Comandos Úteis para Manutenção

### Reiniciar o aplicativo

```bash
pm2 restart rira21
```

### Visualizar logs

```bash
pm2 logs rira21
```

### Atualizar o código após alterações no repositório

```bash
git pull
npm install --production
pm2 restart rira21
```

## Solução de Problemas

### Verificar status do servidor

```bash
pm2 status
```

### Verificar logs de erro do Nginx

```bash
sudo tail -f /var/log/nginx/error.log
```

### Verificar se a porta está em uso

```bash
netstat -tulpn | grep 3001
```

### Verificar firewall

Certifique-se de que as portas 80 (HTTP) e 443 (HTTPS) estão abertas no firewall da VPS.

```bash
# Para Ubuntu/Debian com UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Para CentOS/RHEL com firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Suporte

Se encontrar problemas durante a instalação, verifique os logs do aplicativo e do servidor web para identificar possíveis erros.