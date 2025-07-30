import type { GlobalSettings } from '../types';

const SETTINGS_KEY = 'civil-calc-settings';

export const defaultSettings: GlobalSettings = {
  unitSystem: 'metric',
  projectName: 'My Project',
  projectNumber: 'PROJ-001',
  theme: 'dark',
  locale: 'en',
};

/**
 * Retrieves global settings from local storage.
 * @returns The user's settings or the default settings if none are found.
 */
export function getGlobalSettings(): GlobalSettings {
  try {
    const rawData = localStorage.getItem(SETTINGS_KEY);
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      // Return merged object to ensure all keys are present even if settings were saved with an old version
      return { ...defaultSettings, ...parsedData };
    }
  } catch (error) {
    console.error("Error reading settings from local storage:", error);
    return defaultSettings;
  }
  return defaultSettings;
}

/**
 * Saves global settings to local storage.
 * @param settings The settings object to save.
 */
export function saveGlobalSettings(settings: GlobalSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings to local storage:", error);
    alert("Could not save the settings. Your browser's storage might be full.");
  }
}