require('dotenv').config();
const mysql = require('mysql2/promise');

class SettingsService {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Cache for settings to improve performance
    this.settingsCache = new Map();
    this.cacheExpiry = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  // Get a single setting value
  async getSetting(key, defaultValue = null) {
    try {
      // Check cache first
      if (this.settingsCache.has(key) && Date.now() < this.cacheExpiry.get(key)) {
        return this.settingsCache.get(key);
      }

      const [rows] = await this.pool.execute(
        'SELECT setting_value, setting_type FROM website_settings WHERE setting_key = ?',
        [key]
      );
      
      if (rows.length === 0) {
        return defaultValue;
      }
      
      let value = rows[0].setting_value;
      
      // Parse JSON if needed
      if (rows[0].setting_type === 'json' && value) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.error(`Error parsing JSON for setting ${key}:`, e);
          return defaultValue;
        }
      }
      
      // Cache the value
      this.settingsCache.set(key, value);
      this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
      
      return value;
    } catch (error) {
      console.error('Error getting setting:', error);
      return defaultValue;
    }
  }

  // Get multiple settings at once
  async getSettings(keys = []) {
    try {
      if (keys.length === 0) {
        // Get all settings
        const [rows] = await this.pool.execute(
          'SELECT setting_key, setting_value, setting_type FROM website_settings ORDER BY category, sort_order'
        );
        
        const settings = {};
        rows.forEach(row => {
          let value = row.setting_value;
          if (row.setting_type === 'json' && value) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              console.error(`Error parsing JSON for setting ${row.setting_key}:`, e);
              // If JSON parsing fails but it's business_hours, use as string
              if (row.setting_key === 'business_hours') {
                value = row.setting_value;
              }
            }
          }
          settings[row.setting_key] = value;
        });
        
        return settings;
      } else {
        // Get specific settings
        const settings = {};
        for (const key of keys) {
          settings[key] = await this.getSetting(key);
        }
        return settings;
      }
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  // Get all settings as a flat array for admin interface
  async getAllSettings() {
    try {
      const [rows] = await this.pool.execute(`
        SELECT setting_key, setting_value as value, setting_type as type, category, 
               display_name, description, is_editable, sort_order,
               created_at, updated_at
        FROM website_settings 
        ORDER BY category, sort_order, display_name
      `);
      
      return rows.map(row => {
        let value = row.value;
        if (row.type === 'json' && value) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error(`Error parsing JSON for setting ${row.setting_key}:`, e);
            // If JSON parsing fails but it's business_hours, use as string
            if (row.setting_key === 'business_hours') {
              value = row.value;
            }
          }
        }
        
        return {
          setting_key: row.setting_key,
          value: value,
          type: row.type,
          category: row.category,
          display_name: row.display_name,
          description: row.description,
          default_value: '', // Not stored in database, use empty string
          is_editable: row.is_editable,
          created_at: row.created_at,
          updated_at: row.updated_at
        };
      });
    } catch (error) {
      console.error('Error getting all settings:', error);
      return [];
    }
  }

  // Get settings grouped by category
  async getSettingsByCategory(category = null) {
    try {
      let query = `
        SELECT setting_key, setting_value, setting_type, category, display_name, description, is_editable
        FROM website_settings 
      `;
      
      let params = [];
      if (category) {
        query += ' WHERE category = ?';
        params.push(category);
      }
      
      query += ' ORDER BY category, sort_order, display_name';
      
      const [rows] = await this.pool.execute(query, params);
      
      if (category) {
        // Return array for specific category
        return rows.map(row => {
          let value = row.setting_value;
          if (row.setting_type === 'json' && value) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              console.error(`Error parsing JSON for setting ${row.setting_key}:`, e);
            }
          }
          
          return {
            key: row.setting_key,
            value: value,
            type: row.setting_type,
            displayName: row.display_name,
            description: row.description,
            isEditable: row.is_editable
          };
        });
      } else {
        // Return grouped object for all categories
        const categorizedSettings = {};
        rows.forEach(row => {
          if (!categorizedSettings[row.category]) {
            categorizedSettings[row.category] = [];
          }
          
          let value = row.setting_value;
          if (row.setting_type === 'json' && value) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              console.error(`Error parsing JSON for setting ${row.setting_key}:`, e);
            }
          }
          
          categorizedSettings[row.category].push({
            key: row.setting_key,
            value: value,
            type: row.setting_type,
            displayName: row.display_name,
            description: row.description,
            isEditable: row.is_editable
          });
        });
        
        return categorizedSettings;
      }
    } catch (error) {
      console.error('Error getting categorized settings:', error);
      return {};
    }
  }

  // Update a setting
  async updateSetting(key, value) {
    try {
      // Clear cache for this key
      this.settingsCache.delete(key);
      this.cacheExpiry.delete(key);
      
      // Get the setting type
      const [typeRows] = await this.pool.execute(
        'SELECT setting_type FROM website_settings WHERE setting_key = ?',
        [key]
      );
      
      if (typeRows.length === 0) {
        throw new Error(`Setting key '${key}' not found`);
      }
      
      let finalValue = value;
      
      // Convert to JSON string if needed
      if (typeRows[0].setting_type === 'json' && typeof value === 'object') {
        finalValue = JSON.stringify(value);
      }
      
      await this.pool.execute(
        'UPDATE website_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
        [finalValue, key]
      );
      
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  // Update multiple settings at once
  async updateSettings(settings) {
    try {
      for (const [key, value] of Object.entries(settings)) {
        await this.updateSetting(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Add a new setting
  async addSetting(key, value, type = 'text', category = 'general', displayName = '', description = '') {
    try {
      let finalValue = value;
      if (type === 'json' && typeof value === 'object') {
        finalValue = JSON.stringify(value);
      }
      
      await this.pool.execute(`
        INSERT INTO website_settings 
        (setting_key, setting_value, setting_type, category, display_name, description) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [key, finalValue, type, category, displayName, description]);
      
      return true;
    } catch (error) {
      console.error('Error adding setting:', error);
      throw error;
    }
  }

  // Delete a setting
  async deleteSetting(key) {
    try {
      this.settingsCache.delete(key);
      this.cacheExpiry.delete(key);
      
      await this.pool.execute(
        'DELETE FROM website_settings WHERE setting_key = ?',
        [key]
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  }

  // Clear the cache
  clearCache() {
    this.settingsCache.clear();
    this.cacheExpiry.clear();
  }

  // Get template-ready settings (commonly used settings in a single object)
  async getTemplateSettings() {
    try {
      const settings = await this.getSettings();
      
      return {
        site: {
          name: settings.site_name || 'Soul Trip Tours',
          tagline: settings.site_tagline || 'Discover Amazing Adventures',
          logo: settings.site_logo || '/logo/soul-trip-logo.png',
          favicon: settings.site_favicon || '/favicon.ico'
        },
        contact: {
          email: settings.contact_email || 'soultripst@gmail.com',
          phone: settings.contact_phone || '+880 1616-578097',
          address: settings.contact_address || 'Green City Regency, 26-27 kakrail, Level-11, Dhaka-1000'
        },
        social: {
          facebook: settings.social_facebook || '',
          instagram: settings.social_instagram || '',
          twitter: settings.social_twitter || '',
          youtube: settings.social_youtube || ''
        },
        hero: {
          title: settings.hero_title || 'Travel Your',
          subtitle: settings.hero_subtitle || 'Small group adventures that bring the world closer.',
          title_highlight: settings.hero_title_highlight || 'Heart Out',
          background: settings.hero_background || ''
        },
        about: {
          title: settings.about_title || 'About Soul Trip Tours',
          description: settings.about_description || 'We are passionate about creating unforgettable travel experiences.'
        },
        footer: {
          description: settings.footer_description || 'Your trusted partner for unforgettable adventures.',
          copyright: settings.footer_copyright || '© 2025 Soul Trip Tours & Travels. All rights reserved.'
        },
        seo: {
          description: settings.meta_description || 'Discover amazing destinations with Soul Trip Tours.',
          keywords: settings.meta_keywords || 'travel, tours, adventures'
        },
        business: {
          hours: settings.business_hours || 'Saturday-Thursday: 9:00 AM - 6:00 PM, Friday: Closed',
          emergency: settings.emergency_contact || '+880 1616-578097'
        },
        notifications: {
          email: settings.notification_email || 'admin@soultriptours.com',
          booking_subject: settings.booking_confirmation_subject || 'Booking Confirmation - Soul Trip Tours'
        }
      };
    } catch (error) {
      console.error('Error getting template settings:', error);
      return this.getDefaultTemplateSettings();
    }
  }

  // Fallback default settings
  getDefaultTemplateSettings() {
    return {
      site: {
        name: 'Soul Trip Tours',
        tagline: 'Discover Amazing Adventures',
        logo: '/logo/soul-trip-logo.png',
        favicon: '/favicon.ico'
      },
      contact: {
        email: 'info@soultriptours.com',
        phone: '+1 (555) 123-4567',
        address: '123 Adventure Street, Travel City, TC 12345'
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      },
      hero: {
        title: 'Travel Your Heart Out',
        subtitle: 'Small group adventures that bring the world closer.',
        background: ''
      },
      footer: {
        description: 'Your trusted partner for unforgettable adventures.',
        copyright: '© 2025 Soul Trip Tours & Travels. All rights reserved.'
      },
      seo: {
        description: 'Discover amazing destinations with Soul Trip Tours.',
        keywords: 'travel, tours, adventures'
      }
    };
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = SettingsService;
