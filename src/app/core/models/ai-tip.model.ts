// Existing AiTip interface
export interface AiTip {
    id: string;
    title: string;
    content: AiTipContent;
    timestamp: Date;
    priority: 'low' | 'medium' | 'high';
    category: string;
    recommendation?: string;
    imageUrl?: string;
    source?: string;
    saved?: boolean;
  }
  
  // Minimal AiTipContent interface for ai-tips.component.ts
  export interface AiTipContent {
    text: string;
    details?: string;
    actionItems?: string[];
  }
  
  // Other interfaces remain unchanged...
  export interface MetricSuggestion {
    label: string;
    currentValue: string;
    targetValue: string;
    isOutOfRange: boolean;
    unit?: string;
  }
  
  export interface MicroclimateInsight {
    zoneId: string;
    zoneLabel: string;
    status: 'optimal' | 'warning' | 'critical';
    metrics: MicroclimateMetric[];
    recommendations: string[];
    timestamp: Date;
  }
  
  export interface MicroclimateMetric {
    name: string;
    currentValue: number;
    optimalRange: Range;
    status: 'optimal' | 'warning' | 'critical';
    trend: 'rising' | 'falling' | 'stable';
    unit: string;
  }
  
  export interface PlantHealthData {
    cropId: string;
    cropName: string;
    healthScore: number; // 0-100
    issues: HealthIssue[];
    lastUpdated: Date;
    imageUrl?: string;
  }
  
  export interface HealthIssue {
    type: string; // 'nutrient deficiency', 'pest', 'disease', etc.
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
    detectedAt: Date;
    resolvedAt?: Date;
  }
  
  export interface Range {
    min: number;
    max: number;
    unit: string;
  }