import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SensorService } from './sensor.service'; // Retained import
import { CropService } from './crop.service'; // Retained import
import { AiTip, AiTipContent } from '../models/ai-tip.model';
import { OperatorFunction } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { SystemHealthSuggestion, GrowthPrediction, OptimalConditions, SensorMetrics } from '../models/ai.model';

interface AiRecommendation {
  id: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  category: 'climate' | 'irrigation' | 'nutrition' | 'pest' | 'general';
  actionRequired: boolean;
  applied: boolean;
}

interface AiChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiBaseUrl}/ai`;

  private recommendationsSubject = new BehaviorSubject<AiRecommendation[]>([]);
  private chatHistorySubject = new BehaviorSubject<AiChatMessage[]>([]);
  private tipsSubject = new BehaviorSubject<AiTip[]>([]); // Added for AI tips

  public recommendations$ = this.recommendationsSubject.asObservable();
  public chatHistory$ = this.chatHistorySubject.asObservable();
  public tips$ = this.tipsSubject.asObservable(); // Observable for AI tips

  constructor(
    private http: HttpClient,
    private sensorService: SensorService, // Retained dependency
    private cropService: CropService // Retained dependency
  ) {
    // Initialize with sample data in development
    if (!environment.production) {
      this.recommendationsSubject.next(this.generateMockRecommendations());
      this.chatHistorySubject.next(this.generateMockChatHistory());
      this.tipsSubject.next(this.generateMockTips()); // Added mock tips initialization
    } else {
      this.fetchRecommendations().subscribe();
    }
  }

  // Existing methods...

  fetchRecommendations(): Observable<AiRecommendation[]> {
    return this.http.get<AiRecommendation[]>(`${this.apiUrl}/recommendations`);
  }

  getRecommendations(category?: string): Observable<AiRecommendation[]> {
    return this.recommendations$;
  }

  applyRecommendation(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommendations/${id}/apply`, {});
  }

  dismissRecommendation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recommendations/${id}`);
  }

  // AI Chatbot methods
  sendMessage(message: string): Observable<AiChatMessage> {
    return this.http.post<AiChatMessage>(`${this.apiUrl}/chat`, { message });
  }

  getChatHistory(): Observable<AiChatMessage[]> {
    return this.chatHistory$;
  }

  // AI health assessment
  getFarmHealthAssessment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-assessment`);
  }

  // Crop recommendations based on current conditions
  getCropRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crop-recommendations`);
  }

  // New methods for AI tips
  getTips(): Observable<AiTip[]> {
    return this.http.get<AiTip[]>(`${this.apiUrl}/tips`);
  }

  refreshTips(): Observable<AiTip[]> {
    return this.http.get<AiTip[]>(`${this.apiUrl}/tips/refresh`).pipe(
      tap((tips) => this.tipsSubject.next(tips)) // Update the BehaviorSubject
    );
  }

  saveTip(tipId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tips/${tipId}/save`, {});
  }

  dismissTip(tipId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tips/${tipId}`);
  }

  // Mock data for development
  private generateMockRecommendations(): AiRecommendation[] {
    return [
      {
        id: '1',
        message: 'Humidity levels are suboptimal for tomatoes. Consider increasing humidity by 10%.',
        priority: 'medium',
        timestamp: new Date(),
        category: 'climate',
        actionRequired: true,
        applied: false
      },
      {
        id: '2',
        message: 'Predicted rain in 48 hours. Consider postponing scheduled irrigation.',
        priority: 'low',
        timestamp: new Date(),
        category: 'irrigation',
        actionRequired: false,
        applied: false
      },
      {
        id: '3',
        message: 'Calcium deficiency detected in eggplants. Add calcium supplement to nutrient solution.',
        priority: 'high',
        timestamp: new Date(),
        category: 'nutrition',
        actionRequired: true,
        applied: false
      }
    ];
  }

  private generateMockChatHistory(): AiChatMessage[] {
    return [
      {
        id: '1',
        content: 'Hello! How can I help with your farm today?',
        sender: 'ai',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        content: 'My tomatoes are showing yellow leaves. Any idea what might be causing this?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3500000)
      },
      {
        id: '3',
        content: 'Based on your current sensor readings, it could be a nitrogen deficiency. I recommend adding a nitrogen-rich fertilizer and ensuring pH levels are between 6.0-6.5 for optimal nutrient absorption.',
        sender: 'ai',
        timestamp: new Date(Date.now() - 3400000)
      }
    ];
  }

  private generateMockTips(): AiTip[] {
    return [
      {
        id: '1',
        title: 'Ventilation Check',
        content: {
          text: 'Ensure proper ventilation in the greenhouse to maintain optimal humidity levels.',
          details: 'Good airflow helps prevent mold and fungal growth while maintaining ideal growing conditions.',
          actionItems: [
            'Check ventilation fans are working',
            'Clean air filters',
            'Adjust vents as needed'
          ]
        },
        timestamp: new Date(),
        priority: 'high',
        category: 'climate',
        recommendation: 'Increase ventilation during peak humidity hours',
        source: 'System Sensors'
      },
      {
        id: '2',
        title: 'Pest Management',
        content: {
          text: 'Inspect plants for signs of pest infestation and apply organic pesticides if necessary.',
          details: 'Regular inspection helps catch pest problems early before they become severe.',
          actionItems: [
            'Check leaf undersides',
            'Look for bite marks',
            'Monitor sticky traps'
          ]
        },
        timestamp: new Date(),
        priority: 'medium',
        category: 'health',
        recommendation: 'Apply neem oil solution if pests are found',
        source: 'Weekly Inspection'
      }
    ];
  }

  getMockTips(): Observable<AiTip[]> {
    const mockTips: AiTip[] = [
      {
        id: '1',
        title: 'Ventilation Check',
        content: {
          text: 'Ensure proper ventilation in the greenhouse to maintain optimal humidity levels.',
          details: 'Good airflow helps prevent mold and fungal growth while maintaining ideal growing conditions.',
          actionItems: [
            'Check ventilation fans are working',
            'Clean air filters',
            'Adjust vents as needed'
          ]
        },
        timestamp: new Date(),
        priority: 'high',
        category: 'climate',
        recommendation: 'Increase ventilation during peak humidity hours',
        source: 'System Sensors'
      },
      {
        id: '2',
        title: 'Pest Management',
        content: {
          text: 'Inspect plants for signs of pest infestation and apply organic pesticides if necessary.',
          details: 'Regular inspection helps catch pest problems early before they become severe.',
          actionItems: [
            'Check leaf undersides',
            'Look for bite marks',
            'Monitor sticky traps'
          ]
        },
        timestamp: new Date(),
        priority: 'medium',
        category: 'health',
        recommendation: 'Apply neem oil solution if pests are found',
        source: 'Weekly Inspection'
      }
    ];

    return of(mockTips).pipe(delay(500));
  }

  getResponse(query: string): Observable<string> {
    return of('This is a mock AI response. In production, this would connect to an AI service.').pipe(delay(500));
  }

  getCropGrowthInsight(cropCycleId: string): Observable<string> {
    return of('Mock crop growth insight based on AI analysis.').pipe(delay(500));
  }

  // This will be replaced with real AI implementation later
  getSystemHealthSuggestions(metrics: SensorMetrics, crops: string[]): Observable<SystemHealthSuggestion[]> {
    // Mock implementation
    const suggestions: SystemHealthSuggestion[] = [];
    
    // Temperature check
    if (metrics.temperature < 20) {
      suggestions.push({
        type: 'warning',
        message: 'Temperature is below optimal range',
        probability: 0.6,
        suggestedActions: ['Increase temperature to 22-23°C', 'Check heating system']
      });
    }

    // Humidity check
    if (metrics.humidity > 70) {
      suggestions.push({
        type: 'warning',
        message: 'High humidity detected',
        probability: 0.7,
        suggestedActions: ['Increase ventilation', 'Monitor for fungal growth']
      });
    }

    return of(suggestions);
  }

  // Placeholder for future AI growth stage prediction
  predictGrowthStage(cropData: {
    cropType: string;
    plantedDate: Date;
    sensorHistory: SensorMetrics[];
  }): Observable<GrowthPrediction> {
    // Mock implementation
    return of({
      currentStage: 'Vegetation',
      progress: 45,
      nextStageDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      recommendations: [
        'Maintain current temperature',
        'Monitor leaf development'
      ]
    });
  }

  // Placeholder for future AI optimal conditions prediction
  predictOptimalConditions(cropType: string, growthStage: string): Observable<OptimalConditions> {
    // Mock implementation based on crop type
    const conditions: OptimalConditions = {
      temperature: { min: 20, max: 25, unit: '°C' },
      humidity: { min: 55, max: 70, unit: '%' },
      light: { min: 500, max: 800, unit: 'lux' },
      ec: { min: 1.5, max: 2.2, unit: 'mS/cm' },
      ph: { min: 6.0, max: 6.8, unit: 'pH' }
    };

    if (cropType === 'Coriander') {
      conditions.temperature = { min: 18, max: 22, unit: '°C' };
      conditions.humidity = { min: 50, max: 60, unit: '%' };
    }

    return of(conditions);
  }

  // Add more placeholder methods for future AI features
}

function tap<T>(onNext: (value: T) => void): OperatorFunction<T, T> {
  return (source$) =>
    source$.pipe(
      map((value) => {
        onNext(value);
        return value;
      })
    );
}
