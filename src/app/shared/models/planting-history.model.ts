export interface PlantingHistory {
    id: string;
    plantName: string;
    plantingDate: Date;
    harvestDate: Date;
    status: string; // e.g., 'active', 'completed'
    yield: number;
    yieldUnit: string; // e.g., 'kg', 'g'
    notes?: string; // Optional field for additional information
  }