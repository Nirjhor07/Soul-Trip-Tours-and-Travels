const SettingsService = require('./services/SettingsService.js');

async function fixHeroTitle() {
  try {
    const settingsService = new SettingsService();
    
    console.log('🔧 Fixing hero title duplication...\n');
    
    // Update hero_title to only the first part
    await settingsService.updateSetting('hero_title', 'Travel Your');
    console.log('✅ Updated hero_title to: "Travel Your"');
    
    // Add hero_title_highlight setting if it doesn't exist
    try {
      await settingsService.addSetting('hero_title_highlight', 'Heart Out', 'text', 'homepage', 'Hero Title Highlight', 'The highlighted part of the hero title');
      console.log('✅ Added hero_title_highlight: "Heart Out"');
    } catch (error) {
      // Setting might already exist, so let's update it
      await settingsService.updateSetting('hero_title_highlight', 'Heart Out');
      console.log('✅ Updated hero_title_highlight: "Heart Out"');
    }
    
    // Clear cache and verify
    settingsService.clearCache();
    const settings = await settingsService.getTemplateSettings();
    
    console.log('\n📊 Fixed settings:');
    console.log('  hero.title:', `"${settings.hero.title}"`);
    console.log('  hero.subtitle:', `"${settings.hero.subtitle}"`);
    
    await settingsService.close();
    console.log('\n🎯 Title fixed! Now it will show: "Travel Your Heart Out" without duplication.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

fixHeroTitle();
