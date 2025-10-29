const SettingsService = require('./services/SettingsService.js');

async function updateContactSettings() {
  try {
    const settingsService = new SettingsService();
    
    console.log('📞 Updating contact settings to match your business...\n');
    
    // Update contact settings with your actual information
    await settingsService.updateSetting('contact_email', 'soultripst@gmail.com');
    await settingsService.updateSetting('contact_phone', '+880 1616-578097');
    await settingsService.updateSetting('contact_address', 'Green City Regency,26-27 kakrail, Level 11, Dhaka-1000');
    await settingsService.updateSetting('business_hours', 'Sat-Thu: 9AM-6PM, Fri: 2PM-6PM');
    
    console.log('✅ Updated contact_email: soultripst@gmail.com');
    console.log('✅ Updated contact_phone: +880 1616-578097');
    console.log('✅ Updated contact_address: Green City Regency,26-27 kakrail, Level 11, Dhaka-1000');
    console.log('✅ Updated business_hours: Sat-Thu: 9AM-6PM, Fri: 2PM-6PM');
    
    // Clear cache and verify
    settingsService.clearCache();
    
    // Check what the template settings will return
    const templateSettings = await settingsService.getTemplateSettings();
    console.log('\n📊 Template will show:');
    console.log('  Contact email:', templateSettings.contact.email);
    console.log('  Contact phone:', templateSettings.contact.phone);
    console.log('  Contact address:', templateSettings.contact.address);
    console.log('  Business hours:', templateSettings.business.hours);
    
    await settingsService.close();
    console.log('\n🎯 Contact information updated! Visit http://localhost:3000/tour/1 to see changes.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

updateContactSettings();
