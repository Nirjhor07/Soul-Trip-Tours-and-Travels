# 🗄️ Database Setup Guide

This guide will help you set up the complete Soul Trip Tours database with all tables, data, and configurations.

## 📋 Quick Setup

### Option 1: Complete Database Restore (Recommended)
Import the complete database dump that includes all tables and data:

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE soultrip;"

# Import the complete database
mysql -u root -p soultrip < database/soultrip.sql
```

### Option 2: Manual Setup
If you prefer step-by-step setup:

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE soultrip;"

# Create tables only
mysql -u root -p soultrip < database/schema.sql

# Add sample data
mysql -u root -p soultrip < database/seed.sql
```

## 🎯 What's Included in soultrip.sql

### 📊 **Database Tables:**
- `tours` - Tour packages and information
- `bookings` - Customer booking records
- `contacts` - Contact form submissions
- `settings` - Website configuration settings
- `about_content` - About page content sections
- `about_team` - Team member information
- `about_stats` - Company statistics
- `about_values` - Company values and principles

### 📝 **Sample Data Included:**
- ✅ **Tour Packages** - Complete tour listings with images
- ✅ **Team Members** - Staff profiles with photos
- ✅ **Company Stats** - Business achievements and numbers
- ✅ **Settings** - Website configuration and content
- ✅ **About Content** - Mission, vision, and company information

## ⚙️ Environment Configuration

After importing the database, configure your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=soultrip
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

# Admin Credentials (customize these)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Email Configuration (for contact forms)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 For Production Deployment

### **Railway Deployment:**
1. Create a MySQL database on Railway
2. Get your DATABASE_URL connection string
3. Import your database:
   ```bash
   mysql -h hostname -u username -p database_name < database/soultrip.sql
   ```

### **Other Hosting Platforms:**
- **Render**: Use their PostgreSQL addon (you may need to convert the SQL)
- **Heroku**: Use ClearDB MySQL addon
- **DigitalOcean**: Create a managed MySQL database

## 🔧 Database Schema Overview

```sql
-- Core Tables
tours (id, title, destination, duration, price, description, image_url, category, status)
bookings (id, name, email, phone, tour_id, travel_date, travelers, status, created_at)
contacts (id, name, email, subject, message, status, created_at)
settings (id, setting_key, setting_value, category, created_at, updated_at)

-- About Page Tables
about_content (id, section_key, section_title, content, image_url, order_index)
about_team (id, name, position, bio, image_url, order_index, created_at, updated_at)
about_stats (id, stat_key, stat_value, stat_label, icon, order_index)
about_values (id, title, description, icon, order_index)
```

## ✅ Verification

After setup, verify your database:

```sql
-- Check if all tables exist
SHOW TABLES;

-- Check tour data
SELECT COUNT(*) as tour_count FROM tours;

-- Check team members
SELECT COUNT(*) as team_count FROM about_team;

-- Check settings
SELECT COUNT(*) as settings_count FROM settings;
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Access Denied Error:**
   ```bash
   # Create MySQL user with proper permissions
   mysql -u root -p
   CREATE USER 'soultrip_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON soultrip.* TO 'soultrip_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Character Set Issues:**
   ```sql
   ALTER DATABASE soultrip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Import Errors:**
   ```bash
   # Import with verbose output to see errors
   mysql -u root -p soultrip < database/soultrip.sql --verbose
   ```

## 📞 Support

If you encounter any database setup issues:
1. Check MySQL version compatibility (8.0+ recommended)
2. Ensure proper user permissions
3. Verify database character set (utf8mb4)
4. Check .env configuration matches your MySQL setup

---

**Your Soul Trip Tours database is now ready to power your full-stack travel website!** 🌍✈️