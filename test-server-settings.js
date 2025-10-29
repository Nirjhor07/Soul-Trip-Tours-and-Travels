const express = require('express');
const SettingsService = require('./services/SettingsService.js');

async function testServerSettings() {
  try {
    const settingsService = new SettingsService();
    
    console.log('=== Testing Server Settings Middleware ===\n');
    
    // Simulate what the server middleware does
    const nestedSettings = await settingsService.getTemplateSettings();
    
    console.log('1. Nested settings from service:');
    console.log('hero.title:', `"${nestedSettings.hero.title}"`);
    console.log('hero.subtitle:', `"${nestedSettings.hero.subtitle}"`);
    console.log();
    
    // Simulate the flattening process in server.js
    const flatSettings = {
        hero_title: nestedSettings.hero.title,
        hero_subtitle: nestedSettings.hero.subtitle,
        site_name: nestedSettings.site.name,
        site_logo: nestedSettings.site.logo
    };
    
    console.log('2. Flattened settings (what templates get):');
    console.log('hero_title:', `"${flatSettings.hero_title}"`);
    console.log('hero_subtitle:', `"${flatSettings.hero_subtitle}"`);
    console.log('site_name:', `"${flatSettings.site_name}"`);
    console.log('site_logo:', `"${flatSettings.site_logo}"`);
    
    await settingsService.close();
  } catch (error) {
    console.error('Error testing server settings:', error);
  } finally {
    process.exit(0);
  }
}

testServerSettings();
