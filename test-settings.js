const SettingsService = require('./services/SettingsService.js');

async function testSettings() {
  try {
    const settingsService = new SettingsService();
    
    console.log('=== Testing Settings Functionality ===\n');
    
    // Test nested structure from SettingsService
    console.log('1. Nested settings from SettingsService:');
    const nestedSettings = await settingsService.getTemplateSettings();
    console.log('Hero title:', nestedSettings.hero.title);
    console.log('Hero subtitle:', nestedSettings.hero.subtitle);
    console.log();
    
    // Test flat structure (like server.js does)
    console.log('2. Flattened settings (like templates expect):');
    const flatSettings = {
        hero_title: nestedSettings.hero.title,
        hero_subtitle: nestedSettings.hero.subtitle,
        site_name: nestedSettings.site.name,
        contact_email: nestedSettings.contact.email
    };
    console.log('hero_title:', flatSettings.hero_title);
    console.log('hero_subtitle:', flatSettings.hero_subtitle);
    console.log('site_name:', flatSettings.site_name);
    console.log('contact_email:', flatSettings.contact_email);
    console.log();
    
    // Test raw database values
    console.log('3. Raw database values:');
    const rawSettings = await settingsService.getSettings();
    console.log('hero_title from DB:', rawSettings.hero_title);
    console.log('hero_subtitle from DB:', rawSettings.hero_subtitle);
    console.log();
    
    console.log('=== Test complete ===');
    
    await settingsService.close();
  } catch (error) {
    console.error('Error testing settings:', error);
  } finally {
    process.exit(0);
  }
}

testSettings();
