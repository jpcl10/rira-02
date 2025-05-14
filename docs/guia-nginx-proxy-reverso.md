# Guia Passo a Passo: Instalação e Configuração do Nginx como Proxy Reverso para RIRA 21

Este guia fornece instruções detalhadas para instalar e configurar o Nginx como proxy reverso para o sistema RIRA 21, permitindo acesso via domínio sem especificar a porta.

## Pré-requisitos

- Acesso SSH à sua VPS
- Permissões de administrador (sudo)
- Sistema RIRA 21 já instalado e funcionando na porta 3001

## 1. Instalação do Nginx

### Para Ubuntu/Debian:

```bash
# Atualizar os repositórios
sudo apt update

# Instalar o Nginx
sudo apt install nginx -y

# Verificar se o Nginx foi instalado corretamente
sudo systemctl status nginx
```

### Para CentOS/RHEL:

```bash
# Instalar o Nginx
sudo yum install nginx -y

# Iniciar o Nginx
sudo systemctl start nginx

# Verificar status
sudo systemctl status nginx
```

## 2. Configurar o Firewall (se estiver ativo)

### Para Ubuntu/Debian (UFW):

```bash
# Permitir tráfego HTTP (porta 80)
sudo ufw allow 'Nginx HTTP'

# Permitir tráfego HTTPS (porta 443) - para uso futuro com SSL
sudo ufw allow 'Nginx HTTPS'

# Verificar status do firewall
sudo ufw status
```

### Para CentOS/RHEL (firewalld):

```bash
# Permitir tráfego HTTP e HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Verificar configuração
sudo firewall-cmd --list-all
```

## 3. Criar Arquivo de Configuração do Nginx

### Para Ubuntu/Debian:

```bash
# Criar novo arquivo de configuração
sudo nano /etc/nginx/sites-available/rira21
```

### Para CentOS/RHEL:

```bash
# Criar novo arquivo de configuração
sudo nano /etc/nginx/conf.d/rira21.conf
```

### Conteúdo do arquivo de configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    # Se você não tiver um domínio, use o IP da VPS
    # server_name 123.456.789.10;

    # Configurações de log
    access_log /var/log/nginx/rira21_access.log;
    error_log /var/log/nginx/rira21_error.log;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
    }
}
```

> **Nota:** Substitua `seu-dominio.com` pelo seu domínio real. Se você não tiver um domínio, pode usar o endereço IP da sua VPS.

## 4. Ativar a Configuração

### Para Ubuntu/Debian:

```bash
# Criar link simbólico para ativar o site
sudo ln -s /etc/nginx/sites-available/rira21 /etc/nginx/sites-enabled/

# Verificar se a configuração está correta
sudo nginx -t

# Reiniciar o Nginx para aplicar as alterações
sudo systemctl restart nginx
```

### Para CentOS/RHEL:

```bash
# Verificar se a configuração está correta
sudo nginx -t

# Reiniciar o Nginx para aplicar as alterações
sudo systemctl restart nginx
```

## 5. Configurar HTTPS com Certbot (Opcional, mas Recomendado)

### Para Ubuntu/Debian:

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Seguir as instruções na tela
```

### Para CentOS/RHEL:

```bash
# Instalar Certbot
sudo yum install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Seguir as instruções na tela
```

## 6. Verificar a Instalação

Agora você deve poder acessar o sistema RIRA 21 através do seu domínio sem especificar a porta:

- TV: http://seu-dominio.com/tv
- Painel: http://seu-dominio.com/painel
- Status: http://seu-dominio.com/status

Se você configurou HTTPS, use https:// em vez de http://.

## 7. Solução de Problemas Comuns

### Verificar status do Nginx

```bash
sudo systemctl status nginx
```

### Verificar logs do Nginx

```bash
# Log de erros
sudo tail -f /var/log/nginx/error.log

# Log de acesso específico do RIRA 21
sudo tail -f /var/log/nginx/rira21_access.log
sudo tail -f /var/log/nginx/rira21_error.log
```

### Problemas de permissão

Se o Nginx não conseguir acessar o aplicativo RIRA 21, pode ser um problema de permissão:

```bash
# Verificar se o usuário do Nginx (geralmente www-data ou nginx) tem acesso ao diretório do aplicativo
sudo ls -la /caminho/para/seu/repositorio/clonado
```

### Reiniciar todos os serviços

Se tudo mais falhar, tente reiniciar todos os serviços:

```bash
# Reiniciar o aplicativo RIRA 21
pm2 restart rira21

# Reiniciar o Nginx
sudo systemctl restart nginx
```

## 8. Manutenção

### Renovar certificados SSL (se configurado)

Os certificados Let's Encrypt expiram após 90 dias. O Certbot geralmente configura uma tarefa cron para renovação automática, mas você pode verificar manualmente:

```bash
sudo certbot renew --dry-run
```

### Após atualizações do RIRA 21

Se você atualizar o código do RIRA 21, geralmente não é necessário reiniciar o Nginx, apenas o aplicativo:

```bash
git pull
npm install --production
pm2 restart rira21
```

---

Este guia fornece todas as etapas necessárias para configurar o Nginx como proxy reverso para o sistema RIRA 21. Após seguir estas instruções, seu sistema estará acessível através do seu domínio sem a necessidade de especificar a porta 3001.