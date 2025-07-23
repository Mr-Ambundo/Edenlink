// src/app/features/logistics/logistics.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogisticsService } from '../../core/services/logistics.service';
import { SystemStatus, NutrientLevel, WaterLevel, UsageHistory, PumpStatus } from '../../core/models/system-status.model';
import { ChartData, ChartOptions } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.css']
})
export class LogisticsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  systemStatus: SystemStatus = {
    connectionStatus: 'disconnected',
    powerStatus: 'off',
    automationMode: 'manual',
    pumps: [] as PumpStatus[],
    lastUpdated: new Date(),
    status: 'operational',
    message: 'System initialized'
  };

  nutrientLevels: NutrientLevel[] = [{
    id: 'nutrient-a',
    name: 'Nutrient A',
    level: 0,
    percentage: 0,
    unit: 'ppm',
    status: 'normal',
    lastUpdated: new Date()
  }];

  waterLevel: WaterLevel = {
    current: 0,
    capacity: 100,
    percentage: 0,
    status: 'normal',
    lastUpdated: new Date()
  };

  isLoading = true;
  isAutoMode = true;
  
  // Updated chart properties
  waterChartData: any = {
    labels: [],
    datasets: [{
      label: 'Water Usage (L)',
      data: [],
      borderColor: '#006d5b',
      backgroundColor: 'rgba(0, 109, 91, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };

  nutrientChartData: any = {
    labels: [],
    datasets: [{
      label: 'Nutrient Usage (mL)',
      data: [],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
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
        }
      },
      y: {
        beginAtZero: true,
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
        padding: 10
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };
  
  constructor(private logisticsService: LogisticsService) {}

  ngOnInit(): void {
    this.loadLogisticsData();
    this.loadUsageChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogisticsData(): void {
    this.isLoading = true;
    
    this.logisticsService.getNutrientLevels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (nutrients) => {
        this.nutrientLevels = nutrients;
      },
      error: (error) => {
        console.error('Error loading nutrient levels:', error);
      }
    });
    
    this.logisticsService.getWaterLevel().pipe(takeUntil(this.destroy$)).subscribe({
      next: (water) => {
        this.waterLevel = water;
      },
      error: (error) => {
        console.error('Error loading water level:', error);
      }
    });
    
    this.logisticsService.getSystemStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (status) => {
        this.systemStatus = status;
        this.isAutoMode = status.automationMode === 'auto';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading system status:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsageChart(): void {
    this.logisticsService.getUsageHistory().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        // Update water usage chart
        this.waterChartData = {
          labels: data.dates,
          datasets: [{
            label: 'Water Usage (L)',
            data: data.waterUsage,
            borderColor: '#006d5b',
            backgroundColor: 'rgba(0, 109, 91, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          }]
        };

        // Update nutrient usage chart
        this.nutrientChartData = {
          labels: data.dates,
          datasets: [{
            label: 'Nutrient Usage (mL)',
            data: data.nutrientAUsage,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          }]
        };
      },
      error: (error) => {
        console.error('Error loading usage history:', error);
      }
    });
  }

  toggleAutomationMode(): void {
    const newMode = this.isAutoMode ? 'manual' : 'auto';
    
    this.logisticsService.setAutomationMode(newMode).pipe(takeUntil(this.destroy$)).subscribe({
      next: (status) => {
        this.systemStatus = status;
        this.isAutoMode = (status && status.automationMode?.toLowerCase?.()) === 'auto';
        console.log(`Automation mode set to ${this.isAutoMode ? 'auto' : 'manual'}`);
      },
      error: (error) => {
        console.error('Error toggling automation mode:', error);
        // Reset the toggle if there was an error
        this.isAutoMode = !this.isAutoMode;
      }
    });
  }

  activatePump(pumpId: string): void {
    this.logisticsService.activatePump(pumpId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (status) => {
        this.systemStatus = status;
      },
      error: (error) => {
        console.error(`Error activating pump ${pumpId}:`, error);
      }
    });
  }

  refillNutrient(nutrientId: string): void {
    this.logisticsService.confirmNutrientRefill(nutrientId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (nutrients) => {
        this.nutrientLevels = nutrients;
      },
      error: (error) => {
        console.error(`Error confirming refill for nutrient ${nutrientId}:`, error);
      }
    });
  }

  refillWater(): void {
    this.logisticsService.confirmWaterRefill().pipe(takeUntil(this.destroy$)).subscribe({
      next: (water) => {
        this.waterLevel = water;
      },
      error: (error) => {
        console.error('Error confirming water refill:', error);
      }
    });
  }

  getStatusClass(percentage: number): string {
    if (percentage <= 20) return 'critical';
    if (percentage <= 40) return 'warning';
    return 'normal';
  }
}