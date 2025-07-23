import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Feature Components
import { LandingComponent } from './landing/landing.component';
import { MyFarmComponent } from './features/my-farm/my-farm.component';
import { CropRoadmapComponent } from './features/crop-roadmap/crop-roadmap.component';
import { AITipsComponent } from './features/ai-tips/ai-tips.component';
import { LogisticsComponent } from './features/logistics/logistics.component';
import { TrainingComponent } from './features/training/training.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MyFarmComponent,
    CropRoadmapComponent,
    AITipsComponent,
    LogisticsComponent,
    TrainingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    LandingComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }