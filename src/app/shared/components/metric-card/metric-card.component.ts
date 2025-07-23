import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  template: `
    <div class="metric-card" [ngClass]="getStatusClass()">
      <div class="metric-icon">{{ icon }}</div>
      <div class="metric-content">
        <div class="metric-header">
          <h3>{{ name }}</h3>
          <span class="current-value">{{ formatValue(currentValue) }}{{ unit }}</span>
        </div>
        <div class="range-bar">
          <div class="optimal-range" 
               [style.left]="(minOptimal / maxRange * 100) + '%'"
               [style.width]="((maxOptimal - minOptimal) / maxRange * 100) + '%'">
          </div>
          <div class="current-marker"
               [style.left]="(currentValue / maxRange * 100) + '%'">
          </div>
        </div>
        <div class="range-labels">
          <span class="min-label">{{ formatValue(minOptimal) }}{{ unit }}</span>
          <span class="optimal-label">Optimal</span>
          <span class="max-label">{{ formatValue(maxOptimal) }}{{ unit }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      gap: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .metric-card.warning {
      border-left: 4px solid #ffc107;
    }

    .metric-card.danger {
      border-left: 4px solid #dc3545;
    }

    .metric-card.optimal {
      border-left: 4px solid #28a745;
    }

    .metric-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .metric-content {
      flex: 1;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .metric-header h3 {
      margin: 0;
      font-size: 16px;
      color: #343a40;
    }

    .current-value {
      font-size: 18px;
      font-weight: bold;
      color: #212529;
    }

    .range-bar {
      height: 6px;
      background: #e9ecef;
      border-radius: 3px;
      position: relative;
      margin: 8px 0;
    }

    .optimal-range {
      position: absolute;
      height: 100%;
      background: rgba(40, 167, 69, 0.2);
      border-radius: 3px;
    }

    .current-marker {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #212529;
      border-radius: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: left 0.3s ease;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #6c757d;
      margin-top: 4px;
    }
  `]
})
export class MetricCardComponent {
  @Input() name: string = '';
  @Input() icon: string = '';
  @Input() currentValue: number = 0;
  @Input() minOptimal: number = 0;
  @Input() maxOptimal: number = 0;
  @Input() unit: string = '';
  @Input() maxRange: number = 100;

  getStatusClass(): string {
    if (this.currentValue < this.minOptimal) {
      return this.currentValue < this.minOptimal * 0.8 ? 'danger' : 'warning';
    }
    if (this.currentValue > this.maxOptimal) {
      return this.currentValue > this.maxOptimal * 1.2 ? 'danger' : 'warning';
    }
    return 'optimal';
  }

  formatValue(value: number): string {
    // Special handling for light values which are typically whole numbers
    if (this.name === 'Light') {
      return Math.round(value).toString();
    }
    // For all other metrics, show 2 decimal places
    return value.toFixed(2);
  }
} 