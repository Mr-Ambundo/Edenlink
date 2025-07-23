// src/app/features/my-farm/my-farm.component.ts
import { Component, OnInit } from '@angular/core';
import { CropService } from '../../core/services/crop.service';
import { Crop } from '../../core/models/crop.model';
import { PlantingHistory } from '../../shared/models/planting-history.model';

@Component({
  selector: 'app-my-farm',
  templateUrl: './my-farm.component.html',
  styleUrls: ['./my-farm.component.css']
})
export class MyFarmComponent implements OnInit {
  plantingHistory: PlantingHistory[] = [];
  suggestedPlants: Crop[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = true;
  public Math = Math;

  spinachCrop: Crop = {
    id: 'spinach-template',
    name: 'Spinach',
    scientificName: 'Spinacia oleracea',
    imageUrl: '/assets/images/spinach.jpg',
    category: 'Vegetable',
    growthCycle: 45,
    currentStage: {
      id: 'stage-1',
      name: 'Seedling',
      order: 1,
      description: 'Initial growth stage',
      startDate: new Date(),
      isCompleted: false,
      requiredActions: [],
      idealConditions: {
        temperature: { min: 15, max: 21, unit: '°C' },
        humidity: { min: 60, max: 70, unit: '%' },
        light: { min: 12000, max: 18000, unit: 'lux' },
        ph: { min: 6.0, max: 7.0, unit: 'pH' },
        ec: { min: 1.0, max: 1.5, unit: 'mS/cm' }
      }
    },
    plantedDate: new Date(),
    expectedHarvestDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'active',
    health: 100,
    farmId: 'default-farm',
    zoneId: 'default-zone',
    idealTemperature: 18,
    idealHumidity: 65,
    idealLight: 15000,
    aiSuggestion: 'Perfect for your current soil conditions and climate.'
  };

  constructor(private cropService: CropService) { }

  ngOnInit(): void {
    this.loadPlantingHistory();
    this.loadSuggestedPlants();
  }

  loadPlantingHistory(): void {
    this.isLoading = true;
    this.cropService.getPlantingHistory(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.plantingHistory = data.history;
        this.totalItems = data.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading planting history:', error);
        this.isLoading = false;
      }
    });
  }

  loadSuggestedPlants(): void {
    this.cropService.getSuggestedPlants().subscribe({
      next: (plants) => {
        this.suggestedPlants = plants;
      },
      error: (error) => {
        console.error('Error loading suggested plants:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPlantingHistory();
  }

  viewPlantDetails(crop: Crop): void {
    // To be implemented when routing is set up
    console.log('View details for plant:', crop);
  }
}