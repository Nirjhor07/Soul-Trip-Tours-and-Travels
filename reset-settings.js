const SettingsService = require('./services/SettingsService.js');

async function resetAndTestSettings() {
  try {
    const settingsService = new SettingsService();
    
    console.log('🔄 Resetting and testing settings...\n');
    
    // Reset hero title to proper value
    await settingsService.updateSetting('hero_title', 'Travel Your Heart Out');
    console.log('✅ Updated hero_title to: "Travel Your Heart Out"');
    
    // Test updating hero subtitle
    const newSubtitle = 'Experience the world with small group adventures.';
    await settingsService.updateSetting('hero_subtitle', newSubtitle);
    console.log('✅ Updated hero_subtitle to:', `"${newSubtitle}"`);
    
    // Clear cache and verify
    settingsService.clearCache();
    const settings = await settingsService.getTemplateSettings();
    
    console.log('\n📊 Current settings after update:');
    console.log('  hero.title:', `"${settings.hero.title}"`);
    console.log('  hero.subtitle:', `"${settings.hero.subtitle}"`);
    
    await settingsService.close();
    console.log('\n🎯 Settings updated successfully! Refresh your browser to see changes.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

resetAndTestSettings();
