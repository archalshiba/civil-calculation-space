
import type { SavedCalculationItem } from '../types';

const STORAGE_KEY = 'civil-calc-projects';

/**
 * Retrieves all saved calculations from local storage.
 * @returns An array of saved calculation items.
 */
export function getSavedCalculations(): SavedCalculationItem[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      // Basic validation to ensure it's an array
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Error reading from local storage:", error);
    return [];
  }
  return [];
}

/**
 * Saves a new calculation item to local storage.
 * @param item The calculation item to save.
 */
export function saveCalculation(item: SavedCalculationItem): void {
  const items = getSavedCalculations();
  items.unshift(item); // Add new item to the beginning of the list
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving to local storage:", error);
    throw new Error("Could not save the calculation. Your browser's storage might be full.");
  }
}

/**
 * Deletes a calculation item from local storage by its ID.
 * @param id The ID of the item to delete.
 * @returns The updated array of items.
 */
export function deleteCalculation(id: string): SavedCalculationItem[] {
  let items = getSavedCalculations();
  items = items.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
  } catch (error) {
    console.error("Error updating local storage:", error);
    throw new Error("Could not delete the calculation.");
  }
}


/**
 * Overwrites all saved calculations in local storage with a new set.
 * @param items The new array of calculation items to save.
 */
export function overwriteProject(items: SavedCalculationItem[]): void {
  // Basic validation to ensure we're saving an array.
  if (!Array.isArray(items)) {
    console.error("Attempted to overwrite project with non-array data.");
    throw new Error("Import failed: The provided file is not a valid project file.");
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error overwriting project in local storage:", error);
    throw new Error("Could not import the project. Your browser's storage might be full.");
  }
}