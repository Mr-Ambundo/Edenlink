import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Sensor } from '../models/sensor.model';
import { SensorReading } from '../models/sensor.model'; // Ensure SensorReading is imported

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = `${environment.apiBaseUrl}/sensors`;

  // BehaviorSubjects to store real-time data
  private sensorsSubject = new BehaviorSubject<Sensor[]>([]);
  private sensorHistorySubject = new BehaviorSubject<any[]>([]);

  // Public observable that components can subscribe to
  public sensors$ = this.sensorsSubject.asObservable();
  public sensorHistory$ = this.sensorHistorySubject.asObservable();

  constructor(private http: HttpClient) {
    // Start polling for sensor data every 30 seconds
    this.startPolling();
  }

  startPolling() {
    timer(0, 30000).pipe(
      switchMap(() => this.fetchSensors())
    ).subscribe();
  }

  fetchSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiUrl).pipe(
      tap(sensors => this.sensorsSubject.next(sensors))
    );
  }

  getSensorById(id: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/${id}`);
  }

  getSensorHistory(id: string, days: number = 7): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/history?days=${days}`).pipe(
      tap(history => this.sensorHistorySubject.next(history))
    );
  }

  getSensorTypes(): Observable<string[]> {
    return this.sensors$.pipe(
      map(sensors => [...new Set(sensors.map(s => s.type))])
    );
  }

  // Helper methods to get specific sensor readings
  getTemperatureSensors(): Observable<Sensor[]> {
    return this.sensors$.pipe(
      map(sensors => sensors.filter(s => s.type === 'temperature'))
    );
  }

  getHumiditySensors(): Observable<Sensor[]> {
    return this.sensors$.pipe(
      map(sensors => sensors.filter(s => s.type === 'humidity'))
    );
  }

  getLightSensors(): Observable<Sensor[]> {
    return this.sensors$.pipe(
      map(sensors => sensors.filter(s => s.type === 'light'))
    );
  }

  getECSensors(): Observable<Sensor[]> {
    return this.sensors$.pipe(
      map(sensors => sensors.filter(s => s.type === 'ec'))
    );
  }

  getPHSensors(): Observable<Sensor[]> {
    return this.sensors$.pipe(
      map(sensors => sensors.filter(s => s.type === 'ph'))
    );
  }

  // New method: Get the latest sensor readings
  getLatestReadings(): Observable<SensorReading[]> {
    // Mock implementation or actual API call
    return of([
      { sensorId: '1', sensorType: 'temperature', value: 25, minThreshold: 15, maxThreshold: 30, unit: '°C', timestamp: new Date(), status: 'normal' },
      { sensorId: '2', sensorType: 'humidity', value: 60, minThreshold: 30, maxThreshold: 70, unit: '%', timestamp: new Date(), status: 'normal' }
    ]);
  }

  // New method: Start irrigation
  startIrrigation(): Observable<void> {
    // Mock implementation of starting irrigation
    console.log('Irrigation started');
    return of();
  }

  // Adjusted method: Export data in JSON format
  exportData(): Observable<string> {
    // Mock implementation for exporting data as JSON
    const mockJsonData = [
      { id: '1', name: 'Temperature Sensor A', type: 'temperature', value: 24.5, unit: '°C', status: 'normal', location: 'Zone A' },
      { id: '2', name: 'Humidity Sensor A', type: 'humidity', value: 65, unit: '%', status: 'warning', location: 'Zone A' },
      { id: '3', name: 'Light Sensor A', type: 'light', value: 850, unit: 'lux', status: 'normal', location: 'Zone A' },
      { id: '4', name: 'EC Sensor B', type: 'ec', value: 1.8, unit: 'mS/cm', status: 'normal', location: 'Zone B' },
      { id: '5', name: 'pH Sensor B', type: 'ph', value: 6.2, unit: 'pH', status: 'normal', location: 'Zone B' }
    ];
    return of(JSON.stringify(mockJsonData, null, 2)); // Pretty-printed JSON
  }

  // For simulating data in development
  generateMockData(): Sensor[] {
    return [
      { id: '1', name: 'Temperature Sensor A', type: 'temperature', value: 24.5, unit: '°C', status: 'normal', location: 'Zone A' },
      { id: '2', name: 'Humidity Sensor A', type: 'humidity', value: 65, unit: '%', status: 'warning', location: 'Zone A' },
      { id: '3', name: 'Light Sensor A', type: 'light', value: 850, unit: 'lux', status: 'normal', location: 'Zone A' },
      { id: '4', name: 'EC Sensor B', type: 'ec', value: 1.8, unit: 'mS/cm', status: 'normal', location: 'Zone B' },
      { id: '5', name: 'pH Sensor B', type: 'ph', value: 6.2, unit: 'pH', status: 'normal', location: 'Zone B' }
    ];
  }
}