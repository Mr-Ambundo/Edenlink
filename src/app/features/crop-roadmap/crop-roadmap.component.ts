// src/app/features/crop-roadmap/crop-roadmap.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CropService } from '../../core/services/crop.service';
import { AiService } from '../../core/services/ai.service';
import { CropCycle } from '../../core/models/crop-cycle.model';
import { CropType } from '../../core/models/crop-type.model';

@Component({
  selector: 'app-crop-roadmap',
  templateUrl: './crop-roadmap.component.html',
  styleUrls: ['./crop-roadmap.component.css']
})
export class CropRoadmapComponent implements OnInit {
  cropForm: FormGroup;
  cropTypes: CropType[] = [];
  currentCropCycle: CropCycle | null = null;
  aiInsight: string = '';
  showAiInsight: boolean = false;
  loadingInsight: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private aiService: AiService
  ) {
    this.cropForm = this.fb.group({
      cropType: ['', Validators.required],
      plantDate: ['', Validators.required],
      cycleDuration: ['12', [Validators.required, Validators.min(1), Validators.max(52)]]
    });
  }

  ngOnInit(): void {
    this.loadCropTypes();
    this.loadCurrentCropCycle();
  }

  loadCropTypes(): void {
    this.cropService.getCropTypes().subscribe({
      next: (types) => {
        this.cropTypes = types;
      },
      error: (error) => {
        console.error('Error loading crop types:', error);
      }
    });
  }

  loadCurrentCropCycle(): void {
    this.cropService.getCurrentCropCycle().subscribe({
      next: (cycle) => {
        this.currentCropCycle = cycle;
        
        if (cycle) {
          // Populate form with current cycle data
          this.cropForm.patchValue({
            cropType: cycle.cropTypeId,
            plantDate: cycle.plantDate,
            cycleDuration: cycle.durationWeeks
          });
        }
      },
      error: (error) => {
        console.error('Error loading current crop cycle:', error);
      }
    });
  }

  calculateProgress(): number {
    if (!this.currentCropCycle) return 0;
    
    const startDate = new Date(this.currentCropCycle.plantDate);
    const today = new Date();
    const totalDays = this.currentCropCycle.durationWeeks * 7;
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  }

  getCurrentWeek(): number {
    if (!this.currentCropCycle) return 0;
    
    const startDate = new Date(this.currentCropCycle.plantDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.ceil(daysPassed / 7), this.currentCropCycle.durationWeeks);
  }

  onSubmit(): void {
    if (this.cropForm.invalid) return;
    
    const formData = this.cropForm.value;
    const selectedCropType = this.cropTypes.find(ct => ct.id === formData.cropType);
    
    const cropCycle: CropCycle = {
      id: Date.now().toString(), // Generate a temporary ID
      cropTypeId: formData.cropType,
      cropName: selectedCropType?.name || '',
      startDate: new Date(),
      plantDate: formData.plantDate,
      currentStage: 0,
      status: 'active',
      completedStages: [],
      durationWeeks: formData.cycleDuration,
      stages: selectedCropType?.stages.map(s => ({
        name: s.name,
        startWeek: s.duration,
        endWeek: s.duration,
        description: s.description,
        tasks: s.tasks.map(t => ({ description: t, completed: false })),
        completed: false
      })) || []
    };
    
    this.cropService.createCropCycle(cropCycle).subscribe({
      next: (cycle) => {
        this.currentCropCycle = cycle;
      },
      error: (error) => {
        console.error('Error creating crop cycle:', error);
      }
    });
  }
  
  markStageComplete(stageIndex: number): void {
    if (!this.currentCropCycle) return;
    
    this.cropService.completeStage(this.currentCropCycle.id, stageIndex).subscribe({
      next: (success) => {
        if (success && this.currentCropCycle) {
          // Update the local state if the operation was successful
          const updatedStages = [...this.currentCropCycle.stages];
          updatedStages[stageIndex].completed = true;
          this.currentCropCycle = {
            ...this.currentCropCycle,
            stages: updatedStages,
            completedStages: [...this.currentCropCycle.completedStages, stageIndex]
          };
        }
      },
      error: (error) => {
        console.error('Error completing stage:', error);
      }
    });
  }
  
  getAIInsight(): void {
    if (!this.currentCropCycle) return;
    
    this.loadingInsight = true;
    this.aiService.getCropGrowthInsight(this.currentCropCycle.id).subscribe({
      next: (insight) => {
        this.aiInsight = insight;
        this.showAiInsight = true;
        this.loadingInsight = false;
      },
      error: (error) => {
        console.error('Error getting AI insight:', error);
        this.loadingInsight = false;
      }
    });
  }
  
  closeAIInsight(): void {
    this.showAiInsight = false;
  }
}