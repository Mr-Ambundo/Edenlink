export interface WaterLevel {
    level: number; // Percentage (0-100) representing the current water level
    status: 'normal' | 'low' | 'critical'; // Status of the water level
    lastRefilled: Date; // Timestamp of the last refill
  }