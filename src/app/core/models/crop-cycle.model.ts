export interface CropCycle {
    id: string;
    cropTypeId: string;
    cropName: string;
    startDate: Date;
    plantDate: Date;
    currentStage: number;
    status: 'active' | 'completed' | 'cancelled';
    completedStages: number[];
    notes?: string;
    durationWeeks: number;
    stages: CropStage[];
}

export interface CropStage {
    name: string;
    startWeek: number;
    endWeek: number;
    description: string;
    tasks: { description: string; completed: boolean; }[];
    completed: boolean;
} 