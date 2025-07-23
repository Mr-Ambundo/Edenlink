import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';
import { Crop, CropRecommendation, CropStage, CropTemplate } from '../models/crop.model';
import { PlantingHistory } from '../../shared/models/planting-history.model';
import { CropType } from '../models/crop-type.model';
import { CropCycle } from '../models/crop-cycle.model';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private readonly SIMULATED_DELAY = 500;
  
  // Utility function to get relative dates
  private getRelativeDate(daysOffset: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date;
  }

  // Mock data for current crops
  private crops = new BehaviorSubject<Crop[]>([
    {
      id: 'crop1',
      name: 'Bell Pepper',
      scientificName: 'Capsicum annuum',
      imageUrl: '/assets/images/crops/bell-pepper.jpg',
      category: 'Vegetable',
      growthCycle: 100,
      currentStage: {
        id: 'stage3',
        name: 'Flowering',
        order: 3,
        description: 'Plants are developing flowers which will turn into peppers.',
        startDate: this.getRelativeDate(-15),
        isCompleted: false,
        requiredActions: [
          'Monitor temperature between 20-25°C',
          'Maintain humidity around 60-70%',
          'Ensure proper pollination'
        ],
        idealConditions: {
          temperature: { min: 20, max: 25, unit: '°C' },
          humidity: { min: 60, max: 70, unit: '%' },
          light: { min: 14, max: 16, unit: 'hours' },
          ph: { min: 6.0, max: 6.8, unit: 'pH' },
          ec: { min: 1.8, max: 2.2, unit: 'mS/cm' }
        }
      },
      plantedDate: this.getRelativeDate(-45),
      expectedHarvestDate: this.getRelativeDate(55),
      status: 'active',
      health: 95,
      notes: 'Growing well, flowers developing nicely',
      farmId: 'farm1',
      zoneId: 'zone1',
      idealTemperature: 23,
      idealHumidity: 65,
      idealLight: 14000,
      aiSuggestion: 'Growth is on track. Consider increasing pollination activities for better fruit set.'
    },
    {
      id: 'crop2',
      name: 'Coriander',
      scientificName: 'Coriandrum sativum',
      imageUrl: '/assets/images/crops/coriander.jpg',
      category: 'Herb',
      growthCycle: 45,
      currentStage: {
        id: 'stage2',
        name: 'Vegetation',
        order: 2,
        description: 'Plants are developing lush green leaves.',
        startDate: this.getRelativeDate(-5),
        isCompleted: false,
        requiredActions: [
          'Maintain soil moisture',
          'Ensure good air circulation',
          'Monitor for leaf spots'
        ],
        idealConditions: {
          temperature: { min: 18, max: 22, unit: '°C' },
          humidity: { min: 50, max: 60, unit: '%' },
          light: { min: 12, max: 14, unit: 'hours' },
          ph: { min: 6.2, max: 6.8, unit: 'pH' },
          ec: { min: 1.2, max: 1.6, unit: 'mS/cm' }
        }
      },
      plantedDate: this.getRelativeDate(-20),
      expectedHarvestDate: this.getRelativeDate(25),
      status: 'active',
      health: 90,
      farmId: 'farm1',
      zoneId: 'zone2',
      idealTemperature: 20,
      idealHumidity: 55,
      idealLight: 12000,
      aiSuggestion: 'Consider harvesting outer leaves to promote bushier growth.'
    }
  ]);

  // Mock data for planting history with relative dates
  private plantingHistory = new BehaviorSubject<PlantingHistory[]>([
    {
      id: 'history1',
      plantName: 'Cherry Tomatoes',
      plantingDate: this.getRelativeDate(-90),
      harvestDate: this.getRelativeDate(-30),
      status: 'completed',
      yield: 5,
      yieldUnit: 'kg',
      notes: 'Good yield, but some pest issues noted.'
    },
    {
      id: 'history2',
      plantName: 'Basil',
      plantingDate: this.getRelativeDate(-60),
      harvestDate: this.getRelativeDate(-15),
      status: 'completed',
      yield: 2,
      yieldUnit: 'kg',
      notes: 'Excellent growth, no issues.'
    },
    {
      id: 'history3',
      plantName: 'Lettuce',
      plantingDate: this.getRelativeDate(-45),
      harvestDate: this.getRelativeDate(-30),
      status: 'completed',
      yield: 3,
      yieldUnit: 'kg',
      notes: 'Some issues with nutrient levels.'
    }
  ]);

  constructor() {}

  // CRUD Operations for Crops
  getCrops(filters?: { category?: string; status?: string }): Observable<Crop[]> {
    return this.crops.asObservable().pipe(
      map(crops => {
        if (!filters) return crops;
        return crops.filter(crop => {
          const categoryMatch = !filters.category || crop.category === filters.category;
          const statusMatch = !filters.status || crop.status === filters.status;
          return categoryMatch && statusMatch;
        });
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError('Failed to fetch crops', error))
    );
  }

  getCropById(id: string): Observable<Crop> {
    return this.crops.asObservable().pipe(
      map(crops => {
        const crop = crops.find(c => c.id === id);
        if (!crop) throw new Error('Crop not found');
        return crop;
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError(`Failed to fetch crop with id ${id}`, error))
    );
  }

  addCrop(crop: Omit<Crop, 'id'>): Observable<Crop> {
    const newCrop = { ...crop, id: Date.now().toString() };
    return of(newCrop).pipe(
      tap(() => {
        const currentCrops = this.crops.getValue();
        this.crops.next([...currentCrops, newCrop]);
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError('Failed to add crop', error))
    );
  }

  updateCrop(id: string, updates: Partial<Crop>): Observable<Crop> {
    return this.crops.pipe(
      map(crops => {
        const existingCrop = crops.find(c => c.id === id);
        if (!existingCrop) throw new Error('Crop not found');
        
        const updatedCrop = { ...existingCrop, ...updates, lastUpdated: new Date() };
        const updatedCrops = crops.map(crop => crop.id === id ? updatedCrop : crop);
        this.crops.next(updatedCrops);
        return updatedCrop;
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError(`Failed to update crop ${id}`, error))
    );
  }

  deleteCrop(id: string): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        const currentCrops = this.crops.getValue();
        const updatedCrops = currentCrops.filter(crop => crop.id !== id);
        this.crops.next(updatedCrops);
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError(`Failed to delete crop ${id}`, error))
    );
  }

  // Enhanced Planting History methods
  getPlantingHistory(page: number, itemsPerPage: number, filters?: { status?: string; plantName?: string }): Observable<{ history: PlantingHistory[]; total: number }> {
    return of(this.plantingHistory.getValue()).pipe(
      map(history => {
        let filteredHistory = history;
        if (filters) {
          filteredHistory = history.filter(record => {
            const statusMatch = !filters.status || record.status === filters.status;
            const nameMatch = !filters.plantName || record.plantName.toLowerCase().includes(filters.plantName.toLowerCase());
            return statusMatch && nameMatch;
          });
        }
    const startIndex = (page - 1) * itemsPerPage;
        return {
          history: filteredHistory.slice(startIndex, startIndex + itemsPerPage),
          total: filteredHistory.length
        };
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError('Failed to fetch planting history', error))
    );
  }

  // Enhanced Suggested Plants method
  getSuggestedPlants(limit: number = 5): Observable<Crop[]> {
    return this.crops.asObservable().pipe(
      map(crops => {
        // Simulate AI-based sorting by health score and growth performance
        const sortedCrops = [...crops].sort((a, b) => b.health - a.health);
        return sortedCrops.slice(0, limit);
      }),
      delay(this.SIMULATED_DELAY),
      catchError(error => this.handleError('Failed to fetch suggested plants', error))
    );
  }

  // Error handling
  private handleError(message: string, error: any): Observable<never> {
    console.error(message, error);
    return throwError(() => new Error(`${message}: ${error.message || 'Unknown error'}`));
  }

  getCropTypes(): Observable<CropType[]> {
    const mockCropTypes: CropType[] = [
      {
        id: '1',
        name: 'Tomato',
        description: 'Indeterminate tomato variety suitable for greenhouse cultivation',
        growthDuration: 90,
        idealTemperature: 25,
        idealHumidity: 65,
        idealLight: 30000,
        stages: [
          {
            name: 'Seedling',
            duration: 14,
            description: 'Initial growth stage from seed to small plant',
            tasks: ['Monitor moisture', 'Maintain temperature']
          },
          {
            name: 'Vegetative',
            duration: 30,
            description: 'Main growth phase',
            tasks: ['Regular pruning', 'Support installation']
          },
          {
            name: 'Flowering',
            duration: 20,
            description: 'Flower development phase',
            tasks: ['Pollination', 'Nutrient adjustment']
          },
          {
            name: 'Fruiting',
            duration: 26,
            description: 'Fruit development and ripening',
            tasks: ['Support maintenance', 'Harvest timing']
          }
        ]
      }
    ];
    return of(mockCropTypes).pipe(delay(500));
  }

  getCurrentCropCycle(): Observable<CropCycle> {
    const mockCropCycle: CropCycle = {
      id: '1',
      cropTypeId: '1',
      cropName: 'Tomato',
      startDate: new Date(2024, 0, 1),
      plantDate: new Date(2024, 0, 1),
      currentStage: 2,
      status: 'active',
      completedStages: [0, 1],
      notes: 'Healthy growth observed',
      durationWeeks: 12,
      stages: [
        {
          name: 'Seedling',
          startWeek: 1,
          endWeek: 2,
          description: 'Initial growth stage from seed to small plant',
          tasks: [
            { description: 'Monitor moisture', completed: true },
            { description: 'Maintain temperature', completed: true }
          ],
          completed: true
        },
        {
          name: 'Vegetative',
          startWeek: 3,
          endWeek: 6,
          description: 'Main growth phase',
          tasks: [
            { description: 'Regular pruning', completed: true },
            { description: 'Support installation', completed: true }
          ],
          completed: true
        },
        {
          name: 'Flowering',
          startWeek: 7,
          endWeek: 9,
          description: 'Flower development phase',
          tasks: [
            { description: 'Pollination', completed: false },
            { description: 'Nutrient adjustment', completed: false }
          ],
          completed: false
        }
      ]
    };
    return of(mockCropCycle).pipe(delay(500));
  }

  createCropCycle(cropCycle: CropCycle): Observable<CropCycle> {
    return of({ ...cropCycle, id: Date.now().toString() }).pipe(delay(500));
  }

  completeStage(cropCycleId: string, stageIndex: number): Observable<boolean> {
    return of(true).pipe(delay(500));
  }
}