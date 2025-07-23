export interface LogisticsStatus {
    waterLevel: number;
    nutrientALevel: number;
    nutrientBLevel: number;
    nutrientCLevel: number;
    irrigationAutoMode: boolean;
    nutrientAutoMode: boolean;
    phAutoMode: boolean;
    pumps: Pump[];
    lastUpdated: Date;
  }
  
  export interface Pump {
    id: string;
    name: string;
    type: 'irrigation' | 'nutrient' | 'ph';
    active: boolean;
    flowRate: number;
    runtime: number;
    lastActive: Date;
    maintenanceRequired: boolean;
    maintenanceNote?: string;
  }
  
  export interface ResourceConsumption {
    date: Date;
    waterUsage: number;
    nutrientAUsage: number;
    nutrientBUsage: number;
    energyUsage: number;
  }
  
  export interface MaintenanceLog {
    id: string;
    componentId: string;
    componentType: 'pump' | 'sensor' | 'other';
    actionTaken: string;
    timestamp: Date;
    performedBy: string;
    notes: string;
  }
  
  // New interface: NutrientLevel
  export interface NutrientLevel {
    id: string;
    name: string;
    level: number; // Percentage (0-100)
    unit: string; // e.g., 'ppm'
    status: 'normal' | 'low' | 'critical';
  }
  
  // New interface: WaterLevel
  export interface WaterLevel {
    level: number; // Percentage (0-100)
    status: 'normal' | 'low' | 'critical';
    lastRefilled: Date;
  }
  
  // New interface: SystemStatus
  export interface SystemStatus {
    status: 'operational' | 'maintenance' | 'error';
    message: string;
    lastChecked: Date;
  }