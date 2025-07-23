import { Component, OnInit, OnDestroy } from '@angular/core';
import { SensorService } from '../../core/services/sensor.service';
import { AiService } from '../../core/services/ai.service';
import { CropService } from '../../core/services/crop.service';
import { interval, Subject, combineLatest, of } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { Sensor } from '../../core/models/sensor.model';
import { ChartConfiguration } from 'chart.js';
import { Crop, CropStage } from '../../core/models/crop.model';
import { SystemHealthSuggestion, SensorMetrics } from '../../core/models/ai.model';

interface CurrentMetrics {
  temperature: number;
  humidity: number;
  light: number;
  ec: number;
  ph: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
    borderWidth: number;
  }>;
}

interface RoadmapStage {
  name: string;
  completed: boolean;
  active: boolean;
  description?: string;
  startDate?: Date;
  requiredActions?: string[];
}

interface CropCycle {
  crop: Crop;
  stages: RoadmapStage[];
}

interface SystemHealth {
  status: 'excellent' | 'warning' | 'critical';
  message: string;
  suggestions: string[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private updateInterval$ = interval(5000);

  currentMetrics: CurrentMetrics = {
    temperature: 24,
    humidity: 65,
    light: 650,
    ec: 1.8,
    ph: 6.2
  };

  systemHealth: SystemHealth = {
    status: 'excellent',
    message: 'All systems functioning optimally. Consider adjusting humidity levels for optimal bell pepper and coriander growth.',
    suggestions: ['Monitor current settings', 'Check sensor calibration']
  };

  chartData: ChartData | null = null;
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.3)'
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Time',
          color: '#666',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.3)'
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          size: 11
        },
        titleFont: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false
    }
  };

  currentCrop: Crop | null = null;
  roadmapStages: RoadmapStage[] = [];
  cropCycles: CropCycle[] = [];

  constructor(
    private sensorService: SensorService,
    private aiService: AiService,
    private cropService: CropService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupRealTimeUpdates();
    this.loadCurrentCrop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.loadSensorData();
    // Ensure mock crops are loaded if no real data
    this.addMockCrops();
  }

  private setupRealTimeUpdates(): void {
    this.updateInterval$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadSensorData();
    });
  }

  private loadSensorData(): void {
    // Get history for all sensor types
    const sensorIds = ['temp-1', 'humidity-1', 'light-1', 'ec-1', 'ph-1'];
    const histories$ = sensorIds.map(id => this.sensorService.getSensorHistory(id, 1));

    combineLatest(histories$).pipe(
      takeUntil(this.destroy$),
      map(histories => {
        // Update current metrics with the latest values
        this.updateCurrentMetrics(histories);
        // Process data for the chart
        return this.processHistoriesIntoChartData(histories);
      })
    ).subscribe({
      next: (chartData: ChartData) => {
        this.chartData = chartData;
      },
      error: (error: Error) => {
        console.error('Error loading sensor data:', error);
        this.loadMockData();
      }
    });
  }

  private updateCurrentMetrics(histories: any[][]): void {
    // Get the most recent values from each history
    const getLatestValue = (history: any[]) => {
      if (!history || history.length === 0) return null;
      const latestReading = history[history.length - 1];
      return Number(latestReading.value);
    };

    const temperature = getLatestValue(histories[0]);
    const humidity = getLatestValue(histories[1]);
    const light = getLatestValue(histories[2]);
    const ec = getLatestValue(histories[3]);
    const ph = getLatestValue(histories[4]);

    // Update current metrics with real values or fallback to defaults
    this.currentMetrics = {
      temperature: temperature ?? 24,
      humidity: humidity ?? 65,
      light: light ?? 650,
      ec: ec ?? 1.8,
      ph: ph ?? 6.2
    };

    // Update system health status based on current metrics
    this.updateSystemHealth();
  }

  private updateSystemHealth(): void {
    const isOptimal = (value: number, min: number, max: number) => 
      value >= min && value <= max;

    // Get current crop types
    const cropTypes = this.cropCycles.map(cycle => cycle.crop.name);

    // Get AI-powered suggestions using mock implementation
    this.aiService.getSystemHealthSuggestions(this.currentMetrics, cropTypes)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suggestions: SystemHealthSuggestion[]) => {
          // Process suggestions and update system health
          const criticalSuggestions = suggestions.filter(s => s.type === 'critical');
          const warningSuggestions = suggestions.filter(s => s.type === 'warning');

          if (criticalSuggestions.length > 0) {
            this.systemHealth = {
              status: 'critical',
              message: criticalSuggestions[0].message,
              suggestions: criticalSuggestions.flatMap(s => s.suggestedActions)
            };
          } else if (warningSuggestions.length > 0) {
            this.systemHealth = {
              status: 'warning',
              message: warningSuggestions[0].message,
              suggestions: warningSuggestions.flatMap(s => s.suggestedActions)
            };
          } else {
            this.systemHealth = {
              status: 'excellent',
              message: 'All systems functioning optimally based on AI analysis.',
              suggestions: ['Continue current environmental settings', 'Regular monitoring recommended']
            };
          }
        },
        error: (error) => {
          console.error('Error getting AI suggestions:', error);
          this.updateSystemHealthFallback();
        }
      });
  }

  private updateSystemHealthFallback(): void {
    // Existing threshold-based logic as fallback
    const isOptimal = (value: number, min: number, max: number) => 
      value >= min && value <= max;

    const allOptimal = 
      isOptimal(this.currentMetrics.temperature, 20, 25) &&
      isOptimal(this.currentMetrics.humidity, 55, 70) &&
      isOptimal(this.currentMetrics.light, 500, 800) &&
      isOptimal(this.currentMetrics.ec, 1.5, 2.2) &&
      isOptimal(this.currentMetrics.ph, 6.0, 6.8);

    const someWarning = 
      !isOptimal(this.currentMetrics.temperature, 18, 27) ||
      !isOptimal(this.currentMetrics.humidity, 50, 75) ||
      !isOptimal(this.currentMetrics.light, 400, 900) ||
      !isOptimal(this.currentMetrics.ec, 1.2, 2.4) ||
      !isOptimal(this.currentMetrics.ph, 5.8, 7.0);

    if (allOptimal) {
      this.systemHealth = {
        status: 'excellent',
        message: 'All systems functioning optimally.',
        suggestions: ['Continue current environmental settings']
      };
    } else if (someWarning) {
      this.systemHealth = {
        status: 'warning',
        message: 'Some parameters are outside optimal range.',
        suggestions: ['Check environmental controls', 'Monitor crop health']
      };
    } else {
      this.systemHealth = {
        status: 'critical',
        message: 'Critical: Multiple parameters require attention.',
        suggestions: ['Immediate action required', 'Check all systems']
      };
    }
  }

  private processHistoriesIntoChartData(histories: any[][]): ChartData {
    const labels = histories[0]?.map(h => new Date(h.timestamp).toLocaleTimeString()) ?? [];
    const datasets = [
      {
        label: 'Temperature (°C)',
        data: histories[0]?.map(h => Number(h.value)) ?? [],
        borderColor: '#006d5b',
        backgroundColor: 'rgba(0, 109, 91, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2
      },
      {
        label: 'Humidity (%)',
        data: histories[1]?.map(h => Number(h.value)) ?? [],
        borderColor: '#8d90bb',
        backgroundColor: 'rgba(141, 144, 187, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2
      },
      {
        label: 'Light (lux/100)',
        data: histories[2]?.map(h => Number(h.value)) ?? [],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2
      },
      {
        label: 'EC (mS/cm)',
        data: histories[3]?.map(h => Number(h.value)) ?? [],
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2
      },
      {
        label: 'pH',
        data: histories[4]?.map(h => Number(h.value)) ?? [],
        borderColor: '#6610f2',
        backgroundColor: 'rgba(102, 16, 242, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2
      }
    ];

    return { labels, datasets };
  }

  private loadMockData(): void {
    const now = new Date();
    const labels = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getTime() - (11 - i) * 5000);
      return d.toLocaleTimeString('en-US', { hour12: false });
    });
    
    // Generate random values that stay within realistic ranges
    const temperature = 22 + Math.random() * 4;
    const humidity = 60 + Math.random() * 12;
    const light = Math.max(0, 5 + Math.random() * 3) * 100;
    const ec = 1.5 + Math.random() * 0.6;
    const ph = 5.8 + Math.random() * 0.8;

    // Update current metrics with the latest mock values
    this.currentMetrics = {
      temperature,
      humidity,
      light,
      ec,
      ph
    };

    // Update system health based on new values
    this.updateSystemHealth();
    
    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: Array.from({ length: 12 }, (_, i) => i === 11 ? temperature : 22 + Math.random() * 4),
          borderColor: '#006d5b',
          backgroundColor: 'rgba(0, 109, 91, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Humidity (%)',
          data: Array.from({ length: 12 }, (_, i) => i === 11 ? humidity : 60 + Math.random() * 12),
          borderColor: '#8d90bb',
          backgroundColor: 'rgba(141, 144, 187, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Light (lux/100)',
          data: Array.from({ length: 12 }, (_, i) => i === 11 ? light/100 : Math.max(0, 5 + Math.random() * 3)),
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'EC (mS/cm)',
          data: Array.from({ length: 12 }, (_, i) => i === 11 ? ec : 1.5 + Math.random() * 0.6),
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'pH',
          data: Array.from({ length: 12 }, (_, i) => i === 11 ? ph : 5.8 + Math.random() * 0.8),
          borderColor: '#6610f2',
          backgroundColor: 'rgba(102, 16, 242, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }
      ]
    };
  }

  startIrrigation(): void {
    this.sensorService.startIrrigation().subscribe(
      () => {
        console.log('Irrigation started');
      },
      error => {
        console.error('Error starting irrigation:', error);
      }
    );
  }

  exportData(): void {
    this.sensorService.exportData().subscribe(
      (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sensor-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error exporting data:', error);
      }
    );
  }

  private loadCurrentCrop(): void {
    this.cropService.getCrops({ status: 'active' }).pipe(
      takeUntil(this.destroy$),
      switchMap(crops => {
        if (crops && crops.length > 0) {
          // Get AI predictions for each crop
          const predictionRequests = crops.map(crop => {
            return this.aiService.predictGrowthStage({
              cropType: crop.name,
              plantedDate: crop.plantedDate,
              sensorHistory: [] // Add your sensor history data here
            }).pipe(
              map(prediction => ({
                crop,
                prediction
              }))
            );
          });

          return combineLatest(predictionRequests);
        }
        return of([]);
      })
    ).subscribe({
      next: (cropsWithPredictions) => {
        if (cropsWithPredictions.length > 0) {
          this.cropCycles = cropsWithPredictions.map(({ crop, prediction }) => ({
            crop: {
              ...crop,
              aiSuggestion: prediction.recommendations.join(' ')
            },
            stages: this.generateRoadmapStages(crop)
          }));
        } else {
          this.addMockCrops();
        }
      },
      error: (error) => {
        console.error('Error loading current crops with AI predictions:', error);
        this.addMockCrops();
      }
    });
  }

  private addMockCrops(): void {
    const mockCrops: Crop[] = [
      {
        id: 'mock-1',
        name: 'Bell Pepper',
        scientificName: 'Capsicum annuum',
        imageUrl: '/assets/images/crops/bell-pepper.jpg',
        category: 'Vegetable',
        growthCycle: 100, // 100 days total
        currentStage: {
          id: 'stage-3',
          name: 'Flowering',
          order: 3,
          description: 'Plants are developing flowers which will turn into peppers.',
          startDate: new Date(2024, 3, 15), // April 15
          isCompleted: false,
          requiredActions: [
            'Monitor temperature between 20-25°C',
            'Maintain humidity around 60-70%',
            'Ensure proper pollination'
          ],
          idealConditions: {
            temperature: { min: 20, max: 25, unit: '°C' },
            humidity: { min: 60, max: 70, unit: '%' },
            light: { min: 14, max: 16, unit: 'hours' },
            ph: { min: 6.0, max: 6.8, unit: 'pH' },
            ec: { min: 1.8, max: 2.2, unit: 'mS/cm' }
          }
        },
        plantedDate: new Date(2024, 2, 1), // March 1
        expectedHarvestDate: new Date(2024, 5, 10), // June 10
        status: 'active',
        health: 95,
        farmId: 'farm-1',
        zoneId: 'zone-1',
        idealTemperature: 23,
        idealHumidity: 65,
        idealLight: 14000,
        aiSuggestion: 'Growth is on track. Consider increasing pollination activities for better fruit set.'
      },
      {
        id: 'mock-2',
        name: 'Coriander',
        scientificName: 'Coriandrum sativum',
        imageUrl: '/assets/images/crops/coriander.jpg',
        category: 'Herb',
        growthCycle: 45, // 45 days total
        currentStage: {
          id: 'stage-2',
          name: 'Vegetation',
          order: 2,
          description: 'Plants are developing lush green leaves.',
          startDate: new Date(2024, 3, 15), // April 15
          isCompleted: false,
          requiredActions: [
            'Maintain soil moisture',
            'Ensure good air circulation',
            'Monitor for leaf spots'
          ],
          idealConditions: {
            temperature: { min: 18, max: 22, unit: '°C' },
            humidity: { min: 50, max: 60, unit: '%' },
            light: { min: 12, max: 14, unit: 'hours' },
            ph: { min: 6.2, max: 6.8, unit: 'pH' },
            ec: { min: 1.2, max: 1.6, unit: 'mS/cm' }
          }
        },
        plantedDate: new Date(2024, 3, 1), // April 1
        expectedHarvestDate: new Date(2024, 4, 15), // May 15
        status: 'active',
        health: 90,
        farmId: 'farm-1',
        zoneId: 'zone-2',
        idealTemperature: 20,
        idealHumidity: 55,
        idealLight: 12000,
        aiSuggestion: 'Consider harvesting outer leaves to promote bushier growth.'
      }
    ];

    // Fix the method name to match the property
    this.cropCycles = mockCrops.map(crop => ({
      crop,
      stages: this.generateRoadmapStages(crop)
    }));
  }

  private generateRoadmapStages(crop: Crop): RoadmapStage[] {
    const today = new Date();
    const totalDays = Math.ceil((crop.expectedHarvestDate.getTime() - crop.plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSincePlanting = Math.ceil((today.getTime() - crop.plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const progressPercentage = (daysSincePlanting / totalDays) * 100;

    if (crop.name === 'Bell Pepper') {
      return [
        {
          name: 'Germination',
          description: 'Seeds sprouting and developing first leaves',
          startDate: crop.plantedDate,
          requiredActions: ['Maintain soil temperature 20-30°C', 'Keep soil moist'],
          completed: progressPercentage >= 10,
          active: progressPercentage < 10
        },
        {
          name: 'Seedling',
          description: 'Young plants developing true leaves',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.1 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Monitor light levels', 'Begin light fertilization'],
          completed: progressPercentage >= 25,
          active: progressPercentage >= 10 && progressPercentage < 25
        },
        {
          name: 'Vegetation',
          description: 'Plants growing rapidly and developing strong stems',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.25 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Support plant growth', 'Regular pruning'],
          completed: progressPercentage >= 45,
          active: progressPercentage >= 25 && progressPercentage < 45
        },
        {
          name: 'Flowering',
          description: 'Plants developing flowers',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.45 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Ensure pollination', 'Adjust nutrients'],
          completed: progressPercentage >= 65,
          active: progressPercentage >= 45 && progressPercentage < 65
        },
        {
          name: 'Fruit Set',
          description: 'Peppers forming and developing',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.65 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Support heavy fruits', 'Monitor calcium levels'],
          completed: progressPercentage >= 85,
          active: progressPercentage >= 65 && progressPercentage < 85
        },
        {
          name: 'Harvest',
          description: 'Peppers reaching full size and color',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.85 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Check pepper maturity', 'Harvest regularly'],
          completed: progressPercentage >= 100,
          active: progressPercentage >= 85 && progressPercentage < 100
        }
      ];
    } else {
      // Coriander stages
      return [
        {
          name: 'Germination',
          description: 'Seeds sprouting and developing first leaves',
          startDate: crop.plantedDate,
          requiredActions: ['Keep soil moist', 'Maintain warm temperature'],
          completed: progressPercentage >= 15,
          active: progressPercentage < 15
        },
        {
          name: 'Seedling',
          description: 'Young plants developing true leaves',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.15 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Thin seedlings', 'Monitor moisture'],
          completed: progressPercentage >= 35,
          active: progressPercentage >= 15 && progressPercentage < 35
        },
        {
          name: 'Vegetation',
          description: 'Plants developing full leaf growth',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.35 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Regular watering', 'Light fertilization'],
          completed: progressPercentage >= 70,
          active: progressPercentage >= 35 && progressPercentage < 70
        },
        {
          name: 'Mature',
          description: 'Plants reaching full size with mature leaves',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.70 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Begin harvesting leaves', 'Maintain moisture'],
          completed: progressPercentage >= 90,
          active: progressPercentage >= 70 && progressPercentage < 90
        },
        {
          name: 'Harvest',
          description: 'Full harvest stage',
          startDate: new Date(crop.plantedDate.getTime() + (totalDays * 0.90 * 24 * 60 * 60 * 1000)),
          requiredActions: ['Regular harvesting', 'Monitor for bolting'],
          completed: progressPercentage >= 100,
          active: progressPercentage >= 90 && progressPercentage < 100
        }
      ];
    }
  }

  private createRoadmapStagesWithAI(crop: Crop, prediction: any): RoadmapStage[] {
    // Get optimal conditions for current stage
    this.aiService.predictOptimalConditions(crop.name, prediction.currentStage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conditions) => {
          // Update crop's ideal conditions based on AI predictions
          crop.idealTemperature = (conditions.temperature.min + conditions.temperature.max) / 2;
          crop.idealHumidity = (conditions.humidity.min + conditions.humidity.max) / 2;
          crop.idealLight = (conditions.light.min + conditions.light.max) / 2;
        },
        error: (error) => {
          console.error('Error getting optimal conditions:', error);
        }
      });

    // Create stages based on AI prediction
    return this.createStagesFromPrediction(crop, prediction);
  }

  private createStagesFromPrediction(crop: Crop, prediction: any): RoadmapStage[] {
    // Your existing stage creation logic, but use prediction data
    // to determine current stage, progress, and recommendations
    const stages = crop.name === 'Bell Pepper' ? 
      this.createBellPepperStages(crop, prediction) :
      this.createCorianderStages(crop, prediction);

    return stages;
  }

  private createBellPepperStages(crop: Crop, prediction: any): RoadmapStage[] {
    // Implementation of createBellPepperStages method
    // This method should return an array of RoadmapStage objects
    // based on the prediction data for a Bell Pepper crop
    return [];
  }

  private createCorianderStages(crop: Crop, prediction: any): RoadmapStage[] {
    // Implementation of createCorianderStages method
    // This method should return an array of RoadmapStage objects
    // based on the prediction data for a Coriander crop
    return [];
  }
}