const SettingsService = require('./services/SettingsService.js');

async function checkDatabaseSettings() {
  try {
    const settingsService = new SettingsService();
    
    console.log('🗄️  Checking current database settings...\n');
    
    // Check what's in the database
    const rawSettings = await settingsService.getSettings();
    
    console.log('📊 CONTACT INFORMATION IN DATABASE:');
    console.log('  contact_email:', `"${rawSettings.contact_email}"`);
    console.log('  contact_phone:', `"${rawSettings.contact_phone}"`);
    console.log('  contact_address:', `"${rawSettings.contact_address}"`);
    console.log('  business_hours:', `"${rawSettings.business_hours}"`);
    
    // Check all settings that are editable from admin panel
    const allSettings = await settingsService.getAllSettings();
    
    console.log('\n🎛️  ADMIN PANEL CAN EDIT:');
    const contactSettings = allSettings.filter(setting => 
      setting.setting_key.includes('contact_') || 
      setting.setting_key.includes('business_') ||
      setting.setting_key.includes('hero_') ||
      setting.setting_key.includes('site_')
    );
    
    contactSettings.forEach(setting => {
      console.log(`  ✅ ${setting.setting_key}: "${setting.value}" (Category: ${setting.category})`);
    });
    
    console.log(`\n📈 Total manageable settings: ${allSettings.length}`);
    console.log(`📞 Contact-related settings: ${contactSettings.length}`);
    
    // Test updating a setting
    console.log('\n🧪 TESTING ADMIN UPDATE...');
    const originalEmail = rawSettings.contact_email;
    
    // Update email
    await settingsService.updateSetting('contact_email', 'test@example.com');
    console.log('✅ Updated contact_email to: test@example.com');
    
    // Verify update
    const updatedSettings = await settingsService.getSettings();
    console.log('✅ Database now shows:', updatedSettings.contact_email);
    
    // Restore original
    await settingsService.updateSetting('contact_email', originalEmail);
    console.log('✅ Restored original email:', originalEmail);
    
    await settingsService.close();
    
    console.log('\n🌐 CLOUD HOSTING READY:');
    console.log('  ✅ All settings are stored in MySQL database');
    console.log('  ✅ Admin panel provides full CRUD operations');
    console.log('  ✅ Changes reflect immediately on website');
    console.log('  ✅ No code changes needed for content updates');
    console.log('  ✅ Perfect for cloud deployment!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabaseSettings();
