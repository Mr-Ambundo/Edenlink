import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SystemStatus, NutrientLevel, WaterLevel, UsageHistory, PumpStatus } from '../models/system-status.model';

@Injectable({
  providedIn: 'root'
})
export class LogisticsService {
  private systemStatus$ = new BehaviorSubject<SystemStatus>({
    connectionStatus: 'connected',
    powerStatus: 'on',
    automationMode: 'auto',
    pumps: [
      { id: 'pump1', name: 'Main Pump', status: 'active' as const, flowRate: 2.5 },
      { id: 'pump2', name: 'Nutrient Pump A', status: 'inactive' as const, flowRate: 1.0 },
      { id: 'pump3', name: 'Nutrient Pump B', status: 'inactive' as const, flowRate: 1.0 }
    ],
    lastUpdated: new Date(),
    status: 'operational',
    message: 'System running normally'
  });

  private nutrientLevels$ = new BehaviorSubject<NutrientLevel[]>([
    {
      id: 'nutrient-a',
      name: 'Nutrient A',
      level: 750,
      percentage: 75,
      unit: 'ppm',
      status: 'normal' as const,
      lastUpdated: new Date()
      },
      {
      id: 'nutrient-b',
      name: 'Nutrient B',
      level: 300,
      percentage: 30,
      unit: 'ppm',
      status: 'low' as const,
      lastUpdated: new Date()
    }
  ]);

  private waterLevel$ = new BehaviorSubject<WaterLevel>({
    current: 85,
    capacity: 100,
    percentage: 85,
    status: 'normal' as const,
    lastUpdated: new Date()
  });

  private usageHistory$ = new BehaviorSubject<UsageHistory>({
    dates: this.generateLastSevenDays(),
    waterUsage: [45, 50, 48, 52, 49, 47, 51],
    nutrientAUsage: [12, 15, 13, 14, 12, 11, 13],
    nutrientBUsage: [10, 12, 11, 13, 11, 10, 12]
  });

  constructor() {}

  private generateLastSevenDays(): string[] {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString());
    }
    return dates;
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.systemStatus$.asObservable();
  }

  getNutrientLevels(): Observable<NutrientLevel[]> {
    return this.nutrientLevels$.asObservable();
  }

  getWaterLevel(): Observable<WaterLevel> {
    return this.waterLevel$.asObservable();
  }

  getUsageHistory(): Observable<UsageHistory> {
    return this.usageHistory$.asObservable();
  }

  setAutomationMode(mode: 'auto' | 'manual'): Observable<SystemStatus> {
    const currentStatus = this.systemStatus$.getValue();
    const updatedStatus = {
      ...currentStatus,
      automationMode: mode,
      lastUpdated: new Date()
    };
    this.systemStatus$.next(updatedStatus);
    return this.systemStatus$.asObservable();
  }

  activatePump(pumpId: string): Observable<SystemStatus> {
    const currentStatus = this.systemStatus$.getValue();
    const updatedPumps = currentStatus.pumps.map(pump => 
      pump.id === pumpId 
        ? { ...pump, status: pump.status === 'active' ? ('inactive' as const) : ('active' as const) }
        : pump
    );
    
    const updatedStatus: SystemStatus = {
      ...currentStatus,
      pumps: updatedPumps,
      lastUpdated: new Date()
    };
    
    this.systemStatus$.next(updatedStatus);
    return this.systemStatus$.asObservable();
  }

  confirmNutrientRefill(nutrientId: string): Observable<NutrientLevel[]> {
    const currentLevels = this.nutrientLevels$.getValue();
    const updatedLevels = currentLevels.map(nutrient =>
      nutrient.id === nutrientId
        ? {
            ...nutrient,
            level: 1000,
            percentage: 100,
            status: 'normal' as const,
            lastUpdated: new Date()
          }
        : nutrient
    );
    
    this.nutrientLevels$.next(updatedLevels);
    return this.nutrientLevels$.asObservable();
  }

  confirmWaterRefill(): Observable<WaterLevel> {
    const updatedWaterLevel = {
      ...this.waterLevel$.getValue(),
      current: 100,
      percentage: 100,
      status: 'normal' as const,
      lastUpdated: new Date()
    };
    
    this.waterLevel$.next(updatedWaterLevel);
    return this.waterLevel$.asObservable();
  }
}