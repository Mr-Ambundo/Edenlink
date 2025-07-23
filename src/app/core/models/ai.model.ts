export interface SystemHealthSuggestion {
  type: 'critical' | 'warning' | 'info';
  message: string;
  probability?: number;
  suggestedActions: string[];
}

export interface GrowthPrediction {
  currentStage: string;
  progress: number;
  nextStageDate: Date;
  recommendations: string[];
}

export interface OptimalConditions {
  temperature: { min: number; max: number; unit: string; };
  humidity: { min: number; max: number; unit: string; };
  light: { min: number; max: number; unit: string; };
  ec: { min: number; max: number; unit: string; };
  ph: { min: number; max: number; unit: string; };
}

export interface SensorMetrics {
  temperature: number;
  humidity: number;
  light: number;
  ec: number;
  ph: number;
} 