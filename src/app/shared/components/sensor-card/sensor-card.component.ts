import { Component, Input } from '@angular/core';
import { Sensor } from '../../../core/models/sensor.model';

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  styleUrls: ['./sensor-card.component.css']
})
export class SensorCardComponent {
  @Input() sensor!: Sensor;
}