# 🗄️ Database Setup Guide

## Overview
Soul Trip Tours uses MySQL database with the following structure:
- **Tours** - Tour packages and details
- **Categories** - Tour categories
- **Bookings** - Customer reservations
- **Contacts** - Contact form submissions
- **Settings** - Site configuration
- **About Content** - Dynamic about page content
- **Team Members** - Staff profiles

## 🚀 Quick Setup

### 1. Create Database
```sql
CREATE DATABASE soultrip;
USE soultrip;
```

### 2. Import Schema
```bash
mysql -u your_username -p soultrip < database/schema.sql
```

### 3. Import Sample Data
```bash
mysql -u your_username -p soultrip < database/seed.sql
```

## 🌐 For Deployment (Railway, Render, etc.)

### Environment Variables Required:
```bash
# Database Connection
DB_HOST=your_mysql_host
DB_USER=your_mysql_username  
DB_PASSWORD=your_mysql_password
DB_NAME=soultrip
DB_PORT=3306

# Alternative: Single Connection String
DATABASE_URL=mysql://username:password@host:port/database_name
```

### Sample .env for Production:
```bash
# Database (Railway MySQL example)
DATABASE_URL=mysql://root:password@containers-us-west-1.railway.app:7431/railway

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Server
PORT=3000
NODE_ENV=production
```

## 📋 Database Tables

### Core Tables:
- **categories** - Tour categories (Adventure, Cultural, Wildlife, etc.)
- **tours** - Tour packages with pricing and details
- **bookings** - Customer booking requests
- **contacts** - Contact form submissions
- **settings** - Site-wide configuration
- **about_content** - Dynamic about page sections
- **team_members** - Staff profiles with photos

### Sample Data Included:
- ✅ 6+ Sample tours across different categories
- ✅ Tour categories (Adventure, Cultural, Wildlife, etc.)
- ✅ Sample settings for site configuration
- ✅ Basic about page content
- ✅ Sample team members

## 🔧 Local Development

### 1. Install MySQL
- **Windows:** Download from https://dev.mysql.com/downloads/mysql/
- **Mac:** `brew install mysql`
- **Linux:** `sudo apt-get install mysql-server`

### 2. Create Local Database
```sql
mysql -u root -p
CREATE DATABASE soultrip;
exit
```

### 3. Import Database
```bash
cd your-project-directory
mysql -u root -p soultrip < database/schema.sql
mysql -u root -p soultrip < database/seed.sql
```

### 4. Update .env
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=soultrip
DB_PORT=3306
```

## 🚨 Common Issues

### Connection Errors:
- Verify database credentials in .env
- Ensure MySQL server is running
- Check firewall settings for remote connections

### Missing Tables:
- Run schema.sql first, then seed.sql
- Check for SQL syntax errors in logs

### Empty Data:
- Verify seed.sql imported successfully
- Check for foreign key constraint issues

## 📊 Database Size
- **Schema:** ~15 tables
- **Sample Data:** ~50+ records
- **Size:** Minimal (~1MB with sample data)
- **Hosting:** Compatible with free MySQL hosting tiers

## 🎯 Ready for Production
Your database is designed to work with:
- ✅ **Railway MySQL**
- ✅ **PlanetScale** 
- ✅ **AWS RDS**
- ✅ **DigitalOcean Managed Databases**
- ✅ **Google Cloud SQL**
- ✅ **Any MySQL 5.7+ provider**