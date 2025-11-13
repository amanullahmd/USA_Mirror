# Hostinger Deployment Guide - The USA Mirror

This guide will help you deploy your complete application (database + Node.js app) to Hostinger.

## Overview

Hostinger offers VPS (Virtual Private Server) hosting which is perfect for Node.js applications. You'll be deploying:
- **PostgreSQL Database** (your data)
- **Node.js/Express Backend** (API server)
- **React Frontend** (pre-built and served by Express)

---

## Part 1: Database Deployment

### Step 1: Download Database Package

1. Login to your admin panel at `/admin/login`
2. Go to "Database Tools" in the sidebar
3. Click the **"Hostinger / External DB"** tab
4. Click **"Download Complete Hostinger Package"**
5. Save the `.sql` file to your computer

### Step 2: Create PostgreSQL Database on Hostinger

1. Login to Hostinger hPanel
2. Go to **"Advanced" → "Databases"**
3. Click **"Create Database"**
4. Choose **PostgreSQL**
5. Name your database (e.g., `usa_mirror_db`)
6. Create a database user and password (save these!)
7. Click **"Create"**

### Step 3: Import Database

1. In hPanel, find your new database and click **"Manage" or "phpPgAdmin"**
2. Select your database from the left sidebar
3. Click the **"SQL"** tab at the top
4. Open the downloaded `.sql` file in a text editor
5. Copy **ALL** the SQL content
6. Paste it into the SQL query box
7. Click **"Execute"** or **"Go"**
8. Wait for it to complete (may take a minute)
9. You should see: "Import complete!" message

**✅ Your database is now ready with all tables and data!**

---

## Part 2: Application Code Deployment

### Option A: Deploy to Hostinger VPS (Recommended)

Hostinger VPS gives you full control to run Node.js applications.

#### Prerequisites on VPS:
- Node.js 18+ installed
- npm or yarn installed
- PostgreSQL client installed
- Process manager (PM2) installed

#### Deployment Steps:

1. **Access Your VPS**
   ```bash
   ssh your-username@your-vps-ip
   ```

2. **Install Node.js** (if not installed)
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2** (process manager)
   ```bash
   sudo npm install -g pm2
   ```

4. **Upload Your Code**
   - Option 1: Use Git
     ```bash
     cd /var/www
     git clone <your-repo-url> usa-mirror
     cd usa-mirror
     ```
   
   - Option 2: Use SFTP/SCP to upload files
     - Upload all files from your Replit workspace
     - Make sure to include: `package.json`, `server/`, `client/`, `shared/`, `migrations/`

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Set Environment Variables**
   Create a `.env` file:
   ```bash
   nano .env
   ```
   
   Add these variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/usa_mirror_db
   SESSION_SECRET=your-very-long-random-secret-string-here
   NODE_ENV=production
   PORT=5000
   ```
   
   Replace:
   - `username` and `password` with your database credentials
   - `usa_mirror_db` with your database name
   - `your-very-long-random-secret-string-here` with a secure random string

7. **Build the Frontend**
   ```bash
   npm run build
   ```

8. **Run Database Migrations** (if needed)
   ```bash
   npx drizzle-kit migrate
   ```

9. **Create Admin User**
   You need to create an admin user manually in the database:
   ```bash
   psql -U username -d usa_mirror_db
   ```
   
   Then run:
   ```sql
   INSERT INTO admin_users (username, email, password_hash, created_at)
   VALUES ('admin', 'your-email@example.com', '$2b$10$...(use bcrypt to hash your password)', NOW());
   ```
   
   Or create a script to do this (recommended).

10. **Start the Application with PM2**
    ```bash
    pm2 start npm --name "usa-mirror" -- start
    pm2 save
    pm2 startup
    ```

11. **Configure Nginx** (reverse proxy)
    ```bash
    sudo nano /etc/nginx/sites-available/usa-mirror
    ```
    
    Add:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    
    Enable the site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/usa-mirror /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

12. **Setup SSL** (HTTPS)
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

**✅ Your application is now live!**

---

### Option B: Deploy to Shared Hosting (Limited)

⚠️ **Note**: Most Hostinger shared hosting plans don't support custom Node.js applications. You'll need a VPS plan.

If you have Node.js support on shared hosting:
1. Upload files via File Manager or FTP
2. Create `.htaccess` file to route to Node.js
3. Set environment variables in hosting panel
4. Start Node.js application through hosting control panel

---

## Part 3: Post-Deployment

### Monitor Your Application
```bash
pm2 status
pm2 logs usa-mirror
pm2 monit
```

### Update Your Application
```bash
cd /var/www/usa-mirror
git pull origin main
npm install
npm run build
pm2 restart usa-mirror
```

### Backup Your Database
```bash
pg_dump -U username usa_mirror_db > backup-$(date +%Y%m%d).sql
```

---

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall allows port 5432
- Verify database credentials

### Application Won't Start
- Check logs: `pm2 logs usa-mirror`
- Verify Node.js version: `node --version` (should be 18+)
- Check all environment variables are set
- Verify build completed: check `dist/` directory exists

### Cannot Access Website
- Check Nginx status: `sudo systemctl status nginx`
- Verify DNS points to your VPS IP
- Check firewall allows ports 80 and 443
- Review Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

---

## Important Files Checklist

Make sure you have these files before deploying:
- ✅ `package.json` - Dependencies and scripts
- ✅ `server/` - Backend code
- ✅ `client/` - Frontend code
- ✅ `shared/` - Shared types and schemas
- ✅ `migrations/` - Database migrations
- ✅ `.env` - Environment variables (create on server)
- ✅ Database export SQL file (from Database Tools)

---

## Need Help?

Common Hostinger Support Resources:
- Hostinger Knowledge Base: https://support.hostinger.com
- VPS Management: https://www.hostinger.com/tutorials/vps
- Node.js on VPS: Search Hostinger docs for "Node.js VPS setup"

---

**Good luck with your deployment!** 🚀
