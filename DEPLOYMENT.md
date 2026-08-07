# Command-led deployment guide

This project is deployed as two static React sites on Cloudflare Pages and a
Spring Boot + MySQL API on one Oracle Always Free Ubuntu VM.

## Hostnames

Replace `example-trust.org` everywhere with the domain owned by the trust.

```
hospital.example-trust.org       public website
hospital-admin.example-trust.org admin website
api.hospital.example-trust.org   Spring Boot API
```

## Prerequisites requiring your browser

You must personally sign in to GitHub, Cloudflare, Oracle Cloud, Cloudinary,
and the domain registrar. Passwords, OTPs, card verification, and legal terms
cannot be completed by a terminal agent. Do not paste those credentials into
source code or chat.

## Local Windows commands

Run PowerShell in the project root.

```powershell
git init
git add .
git status
git commit -m "Prepare hospital application for deployment"
```

Install Maven only if it is missing:

```powershell
winget install Apache.Maven
```

Build and validate both frontends:

```powershell
Set-Location '.\Aacharyshree _H\frontend'
npm ci
npm run build
Set-Location '..\..\admin-panel'
npm install
npm run build
```

`npm install` in the admin panel creates `package-lock.json`. Commit that
file. Build the backend after Maven is available:

```powershell
Set-Location '..\aacharyshree-hospital'
mvn clean package -DskipTests
```

## Cloudflare Pages settings

Create two Pages projects from the same private GitHub repository.

| Project | Root directory | Build command | Output | Production variable |
| --- | --- | --- | --- | --- |
| Public | `Aacharyshree _H/frontend` | `npm ci && npm run build` | `dist` | `VITE_API_BASE_URL=https://api.hospital.example-trust.org` |
| Admin | `admin-panel` | `npm ci && npm run build` | `dist` | `VITE_API_BASE_URL=https://api.hospital.example-trust.org` |

Set `NODE_VERSION=22.14.0` in each project. Attach the public and admin
hostnames after the first successful deployment.

## Oracle VM commands

After creating an Ubuntu 24.04 Always Free VM and allowing inbound TCP 80 and
443 in OCI networking, connect with SSH:

```bash
ssh ubuntu@YOUR_SERVER_PUBLIC_IP
sudo apt update
sudo apt install -y openjdk-17-jdk maven mysql-server nginx certbot python3-certbot-nginx git
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Create a database and an application-only database user. Do not expose port
3306 in OCI or UFW.

```bash
sudo mysql
```

```sql
CREATE DATABASE aacharyshree_hospital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hospital_app'@'localhost' IDENTIFIED BY 'USE-A-NEW-LONG-PASSWORD';
GRANT ALL PRIVILEGES ON aacharyshree_hospital.* TO 'hospital_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Clone and build the private GitHub repository:

```bash
sudo mkdir -p /opt/aacharyshree-hospital
sudo chown ubuntu:ubuntu /opt/aacharyshree-hospital
git clone YOUR_PRIVATE_GITHUB_REPOSITORY_URL /opt/aacharyshree-hospital
cd /opt/aacharyshree-hospital/aacharyshree-hospital
mvn clean package -DskipTests
```

Create the secret environment file:

```bash
sudo install -d -m 700 /etc/aacharyshree
sudo nano /etc/aacharyshree/api.env
sudo chmod 600 /etc/aacharyshree/api.env
```

Copy `aacharyshree-hospital/.env.example` values into that file, replacing
every `replace-me` value. For the very first startup only, set
`DB_DDL_AUTO=update`; after the tables exist, change it to `validate` and
restart the API.

Install and start the service:

```bash
sudo cp /opt/aacharyshree-hospital/deployment/oracle/aacharyshree-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aacharyshree-api
sudo systemctl status aacharyshree-api
sudo journalctl -u aacharyshree-api -f
```

Install Nginx after replacing the sample hostname in
`deployment/oracle/api.nginx.conf`:

```bash
sudo cp /opt/aacharyshree-hospital/deployment/oracle/api.nginx.conf /etc/nginx/sites-available/aacharyshree-api
sudo ln -s /etc/nginx/sites-available/aacharyshree-api /etc/nginx/sites-enabled/aacharyshree-api
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Add an `A` DNS record for `api.hospital.example-trust.org` to the VM public IP.
Keep it **DNS only** until the TLS certificate exists. Then run:

```bash
sudo certbot --nginx -d api.hospital.example-trust.org
```

Only after HTTPS works, enable Cloudflare proxying and set SSL/TLS mode to
`Full (strict)`.

## First production data

Start with `DB_DDL_AUTO=update`, then import starter content:

```bash
mysql -u hospital_app -p aacharyshree_hospital < scripts/seed-data.sql
```

Create exactly one first admin using the registration secret, then change the
secret to a different random value or remove the registration endpoint before
opening the admin panel to other people.

## Backups

```bash
sudo cp /opt/aacharyshree-hospital/deployment/oracle/mysql-backup.sh /usr/local/sbin/aacharyshree-mysql-backup
sudo chmod 700 /usr/local/sbin/aacharyshree-mysql-backup
sudo nano /etc/aacharyshree/backup.env
sudo chmod 600 /etc/aacharyshree/backup.env
sudo crontab -e
```

Add this cron line for a daily 02:15 UTC backup:

```cron
15 2 * * * /usr/local/sbin/aacharyshree-mysql-backup
```

Download backups to a separate protected location. A backup on the same VM is
not a disaster-recovery backup.
