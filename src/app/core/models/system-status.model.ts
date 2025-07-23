// filepath: /home/injinia/eden-link/src/app/core/models/system-status.model.ts

export interface SystemStatus {
    connectionStatus: 'connected' | 'disconnected' | 'unstable';
    powerStatus: 'on' | 'off' | 'backup';
    automationMode: 'auto' | 'manual';
    pumps: PumpStatus[];
    lastUpdated: Date;
    status: 'operational' | 'maintenance' | 'error';
    message?: string;
}

export interface PumpStatus {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'error';
    flowRate?: number;
}

export interface NutrientLevel {
    id: string;
    name: string;
    level: number;
    percentage: number;
    unit: string;
    status: 'normal' | 'low' | 'critical';
    lastUpdated?: Date;
}

export interface WaterLevel {
    current: number;
    capacity: number;
    percentage: number;
    status: 'normal' | 'low' | 'critical';
    lastUpdated: Date;
}

export interface UsageHistory {
    dates: string[];
    waterUsage: number[];
    nutrientAUsage: number[];
    nutrientBUsage: number[];
  }