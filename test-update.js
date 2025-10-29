const SettingsService = require('./services/SettingsService.js');

async function testSettingsUpdate() {
  try {
    const settingsService = new SettingsService();
    
    console.log('=== Testing Settings Update Process ===\n');
    
    // 1. Check current database values
    console.log('1. Current database values:');
    const rawSettings = await settingsService.getSettings();
    console.log('hero_title:', `"${rawSettings.hero_title}"`);
    console.log('hero_subtitle:', `"${rawSettings.hero_subtitle}"`);
    console.log('site_name:', `"${rawSettings.site_name}"`);
    console.log();
    
    // 2. Test updating hero title
    console.log('2. Updating hero_title to "Adventure Awaits You"...');
    await settingsService.updateSetting('hero_title', 'Adventure Awaits You');
    
    // 3. Check after update
    console.log('3. After update:');
    const updatedRaw = await settingsService.getSettings();
    console.log('hero_title:', `"${updatedRaw.hero_title}"`);
    console.log('hero_subtitle:', `"${updatedRaw.hero_subtitle}"`);
    console.log();
    
    // 4. Check template settings
    console.log('4. Template settings (nested):');
    const templateSettings = await settingsService.getTemplateSettings();
    console.log('hero.title:', `"${templateSettings.hero.title}"`);
    console.log('hero.subtitle:', `"${templateSettings.hero.subtitle}"`);
    console.log();
    
    // 5. Clear cache and test again
    console.log('5. Clearing cache and testing again...');
    settingsService.clearCache();
    const freshSettings = await settingsService.getTemplateSettings();
    console.log('hero.title (fresh):', `"${freshSettings.hero.title}"`);
    console.log('hero.subtitle (fresh):', `"${freshSettings.hero.subtitle}"`);
    
    await settingsService.close();
  } catch (error) {
    console.error('Error testing settings update:', error);
  } finally {
    process.exit(0);
  }
}

testSettingsUpdate();
