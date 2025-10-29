const SettingsService = require('./services/SettingsService.js');

async function verifyTitleFix() {
  try {
    const settingsService = new SettingsService();
    
    console.log('🔍 Verifying hero title fix...\n');
    
    // Check raw database values
    const rawSettings = await settingsService.getSettings();
    console.log('📊 Database values:');
    console.log('  hero_title:', `"${rawSettings.hero_title}"`);
    console.log('  hero_title_highlight:', `"${rawSettings.hero_title_highlight}"`);
    console.log('  hero_subtitle:', `"${rawSettings.hero_subtitle}"`);
    console.log();
    
    // Check template settings
    const templateSettings = await settingsService.getTemplateSettings();
    console.log('🎨 Template settings:');
    console.log('  hero.title:', `"${templateSettings.hero.title}"`);
    console.log('  hero.title_highlight:', `"${templateSettings.hero.title_highlight}"`);
    console.log('  hero.subtitle:', `"${templateSettings.hero.subtitle}"`);
    console.log();
    
    console.log('🖼️ Template will display:');
    console.log(`  Title: "${templateSettings.hero.title}" + "${templateSettings.hero.title_highlight}"`);
    console.log(`  Result: "${templateSettings.hero.title} ${templateSettings.hero.title_highlight}"`);
    console.log(`  Subtitle: "${templateSettings.hero.subtitle}"`);
    
    await settingsService.close();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

verifyTitleFix();
