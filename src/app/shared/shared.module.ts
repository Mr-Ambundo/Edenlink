import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChartComponent } from './components/chart/chart.component';
import { AiChatbotComponent } from './components/ai-chatbot/ai-chatbot.component';
import { SensorCardComponent } from './components/sensor-card/sensor-card.component';
import { MetricCardComponent } from './components/metric-card/metric-card.component';

@NgModule({
  declarations: [
    SidebarComponent,
    ChartComponent,
    AiChatbotComponent,
    SensorCardComponent,
    MetricCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgChartsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgChartsModule,
    SidebarComponent,
    ChartComponent,
    AiChatbotComponent,
    SensorCardComponent,
    MetricCardComponent
  ]
})
export class SharedModule { } 