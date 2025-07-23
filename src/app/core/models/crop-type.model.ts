export interface CropType {
    id: string;
    name: string;
    description: string;
    growthDuration: number;
    idealTemperature: number;
    idealHumidity: number;
    idealLight: number;
    stages: CropStage[];
}

export interface CropStage {
    name: string;
    duration: number;
    description: string;
    tasks: string[];
} 