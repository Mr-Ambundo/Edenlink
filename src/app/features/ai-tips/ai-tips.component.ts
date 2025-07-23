// src/app/features/ai-tips/ai-tips.component.ts
import { Component, OnInit } from '@angular/core';
import { AiService } from '../../core/services/ai.service';
import { SensorService } from '../../core/services/sensor.service';
import { AiTip } from '../../core/models/ai-tip.model';
import { SensorReading } from '../../core/models/sensor.model';
import { AiTipContent } from '../../core/models/ai-tip.model';


@Component({
  selector: 'app-ai-tips',
  templateUrl: './ai-tips.component.html',
  styleUrls: ['./ai-tips.component.css']
})
export class AITipsComponent implements OnInit {
  tips: AiTip[] = [];
  microclimateTips: AiTip[] = [];
  healthTips: AiTip[] = [];
  generalTips: AiTip[] = [];
  isLoading = true;
  refreshingTips = false;
  lastSensorReadings: { [key: string]: SensorReading } = {};
  
  constructor(
    private aiService: AiService,
    private sensorService: SensorService
  ) {}

  ngOnInit(): void {
    this.loadSensorData();
    this.loadAITips();
  }

  loadSensorData(): void {
    this.sensorService.getLatestReadings().subscribe({
      next: (readings) => {
        readings.forEach(reading => {
          this.lastSensorReadings[reading.sensorType] = reading;
        });
      },
      error: (error) => {
        console.error('Error loading sensor data:', error);
      }
    });
  }

  loadAITips(): void {
    this.isLoading = true;
    this.aiService.getTips().subscribe({
      next: (tips) => {
        this.tips = tips;
        this.categorizeTips();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading AI tips:', error);
        this.isLoading = false;
      }
    });
  }

  categorizeTips(): void {
    this.microclimateTips = this.tips.filter(tip => tip.category === 'climate');
    this.healthTips = this.tips.filter(tip => tip.category === 'health');
    this.generalTips = this.tips.filter(tip => tip.category === 'general');
  }

  refreshTips(): void {
    this.refreshingTips = true;
    this.aiService.refreshTips().subscribe({
      next: (tips) => {
        this.tips = tips;
        this.categorizeTips();
        this.refreshingTips = false;
      },
      error: (error) => {
        console.error('Error refreshing AI tips:', error);
        this.refreshingTips = false;
      }
    });
  }

  getReadingStatus(sensorType: string): string {
    if (!this.lastSensorReadings[sensorType]) return 'unknown';
    
    const reading = this.lastSensorReadings[sensorType];
    
    if (reading.value < (reading.minThreshold ?? 0) || reading.value > (reading.maxThreshold ?? 100)) {
      return 'warning';
    }
    
    return 'normal';
  }

  getReadingValue(sensorType: string): string {
    if (!this.lastSensorReadings[sensorType]) return 'N/A';
    
    const reading = this.lastSensorReadings[sensorType];
    return `${reading.value} ${reading.unit}`;
  }

  saveTip(tipId: string): void {
    this.aiService.saveTip(tipId).subscribe({
      next: () => {
        // Find and update the tip in our local array
        const tip = this.tips.find(t => t.id === tipId);
        if (tip) {
          tip.saved = true;
        }
      },
      error: (error) => {
        console.error('Error saving tip:', error);
      }
    });
  }

  dismissTip(tipId: string): void {
    this.aiService.dismissTip(tipId).subscribe({
      next: () => {
        // Remove the tip from our local arrays
        this.tips = this.tips.filter(t => t.id !== tipId);
        this.categorizeTips();
      },
      error: (error) => {
        console.error('Error dismissing tip:', error);
      }
    });
  }
}