export interface NutrientLevel {
    id: string; // Unique identifier for the nutrient
    name: string; // Name of the nutrient (e.g., "Nitrogen")
    level: number; // Percentage (0-100) representing the current level
    unit: string; // Unit of measurement (e.g., "ppm")
    status: 'normal' | 'low' | 'critical'; // Status of the nutrient level
  }