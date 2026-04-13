# Deploy en VPS Contabo (Ubuntu + Nginx)

## Requisitos previos
- VPS Ubuntu en Contabo con IP 164.68.110.104
- Panel Fácil instalado
- Node.js 20 LTS instalado
- PM2 instalado globalmente
- Dominio lazonacampeon.com apuntando al VPS (ya configurado)

---

## 1. Conectar al VPS

```bash
ssh root@164.68.110.104
```

## 2. Instalar dependencias (si no están)

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# PM2
npm install -g pm2

# Nginx
apt install -y nginx git
```

## 3. Clonar el proyecto

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/TU_USUARIO/la-zona-campeon-web.git la-zona-campeon
cd la-zona-campeon
```

## 4. Configurar variables de entorno

```bash
nano /var/www/la-zona-campeon/.env
```

Contenido del `.env`:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/la-zona-campeon?retryWrites=true&w=majority
NEXT_PUBLIC_SITE_URL=https://lazonacampeon.com
NODE_ENV=production
```

## 5. Instalar dependencias y compilar

```bash
cd /var/www/la-zona-campeon
npm ci
npm run build
```

## 6. Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 status
pm2 startup systemd
pm2 save
```

## 7. Configurar Nginx

```bash
cp /var/www/la-zona-campeon/nginx.conf /etc/nginx/sites-available/lazonacampeon.com
ln -s /etc/nginx/sites-available/lazonacampeon.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 8. SSL con Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d lazonacampeon.com -d www.lazonacampeon.com
certbot renew --dry-run
```

## 9. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Comandos útiles

```bash
# Logs
pm2 logs la-zona-campeon

# Reiniciar
pm2 restart la-zona-campeon

# Re-deploy después de cambios
cd /var/www/la-zona-campeon
git pull
npm ci
npm run build
pm2 restart la-zona-campeon
```

## DNS en GoDaddy (ya configurado)

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | @ | 164.68.110.104 |
| A | www | 164.68.110.104 |
