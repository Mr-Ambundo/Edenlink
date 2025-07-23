// crop.model.ts
export interface Crop {
    id: string;
    name: string;
    scientificName: string;
    imageUrl: string;
    category: string; // 'Vegetable', 'Fruit', 'Herb', etc.
    growthCycle: number; // in days
    currentStage: CropStage;
    plantedDate: Date;
    expectedHarvestDate: Date;
    status: 'active' | 'harvested' | 'failed';
    health: number; // 0-100
    notes?: string;
    farmId: string;
    zoneId: string;
    idealTemperature: number;
    idealHumidity: number;
    idealLight: number;
    aiSuggestion?: string;
  }
  
  export interface CropStage {
    id: string;
    name: string; // 'Germination', 'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting'
    order: number;
    description: string;
    startDate: Date;
    endDate?: Date;
    isCompleted: boolean;
    requiredActions: string[];
    idealConditions: IdealConditions;
  }
  
  export interface IdealConditions {
    temperature: Range;
    humidity: Range;
    light: Range;
    ph: Range;
    ec: Range; // Electrical Conductivity
  }
  
  export interface Range {
    min: number;
    max: number;
    unit: string;
  }
  
  export interface CropRecommendation {
    cropId: string;
    cropName: string;
    imageUrl: string;
    confidenceScore: number; // 0-100
    reason: string;
    idealPlantingDate: Date;
    expectedYield: string;
    compatibleCrops: string[];
  }
  
  export interface CropTemplate {
    id: string;
    name: string;
    scientificName: string;
    imageUrl: string;
    category: string;
    growthCycleDays: number;
    stages: CropStageTemplate[];
    idealConditions: IdealConditions;
  }
  
  export interface CropStageTemplate {
    name: string;
    description: string;
    durationDays: number;
    requiredActions: string[];
    idealConditions: IdealConditions;
  }