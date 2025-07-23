import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { MyFarmComponent } from './features/my-farm/my-farm.component';
import { CropRoadmapComponent } from './features/crop-roadmap/crop-roadmap.component';
import { AITipsComponent } from './features/ai-tips/ai-tips.component';
import { LogisticsComponent } from './features/logistics/logistics.component';
import { TrainingComponent } from './features/training/training.component';
import { SettingsComponent } from './features/settings/settings.component';
import { PartnershipsComponent } from './features/partnerships/partnerships.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'my-farm', component: MyFarmComponent },
  { path: 'crop-roadmap', component: CropRoadmapComponent },
  { path: 'ai-tips', component: AITipsComponent },
  { path: 'logistics', component: LogisticsComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'partnerships', component: PartnershipsComponent },
  { path: '**', redirectTo: '' } // Redirect to landing for unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }