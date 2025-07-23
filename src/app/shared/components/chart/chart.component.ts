import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  
  @Input() type: ChartType = 'line';
  
  @Input() chartOptions: ChartConfiguration['options'] = {
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

  ngOnInit() {
    // Initial setup is now handled by inputs
  }

  ngOnChanges(changes: SimpleChanges) {
    // Component will automatically update when inputs change
  }
}