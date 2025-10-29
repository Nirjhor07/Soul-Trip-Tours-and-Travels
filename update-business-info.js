const SettingsService = require('./services/SettingsService.js');

async function updateBusinessInfo() {
  try {
    const settingsService = new SettingsService();
    
    console.log('🏢 Updating business information to match footer...\n');
    
    // Update contact information to match what's working in footer
    await settingsService.updateSetting('contact_address', 'Green City Regency, 26-27 kakrail, Level-11, Dhaka-1000');
    await settingsService.updateSetting('contact_phone', '+880 1616-578097');
    await settingsService.updateSetting('contact_email', 'soultripst@gmail.com');
    
    // Update business hours with Friday closed
    await settingsService.updateSetting('business_hours', 'Saturday-Thursday: 9:00 AM - 6:00 PM, Friday: Closed');
    
    console.log('✅ Updated contact_address: Green City Regency, 26-27 kakrail, Level-11, Dhaka-1000');
    console.log('✅ Updated contact_phone: +880 1616-578097');
    console.log('✅ Updated contact_email: soultripst@gmail.com');
    console.log('✅ Updated business_hours: Saturday-Thursday: 9:00 AM - 6:00 PM, Friday: Closed');
    
    // Clear cache and verify
    settingsService.clearCache();
    
    // Check what the template settings will return
    const templateSettings = await settingsService.getTemplateSettings();
    console.log('\n📊 Updated settings will show:');
    console.log('  Contact email:', templateSettings.contact.email);
    console.log('  Contact phone:', templateSettings.contact.phone);
    console.log('  Contact address:', templateSettings.contact.address);
    console.log('  Business hours:', templateSettings.business.hours);
    
    await settingsService.close();
    console.log('\n🎯 Business information updated! All pages will now show consistent contact details with Friday marked as closed.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

updateBusinessInfo();
