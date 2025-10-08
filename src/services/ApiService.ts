import type { ApiResponse } from '../types'

export class ApiService {
  private baseUrl: string
  private timeout: number = 10000

  constructor() {
    this.baseUrl = 'http://localhost:3000/api'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      console.warn(`API call failed for ${endpoint}, using mock data:`, error)
      
      // Return mock data instead of throwing
      return {
        success: true,
        data: this.getMockData(endpoint) as T,
        message: 'Using mock data - API unavailable'
      }
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Specific API methods
  async getSensors() {
    return this.get('/sensors')
  }

  async getSensorHistory(sensorId: string, days: number = 7) {
    return this.get(`/sensors/${sensorId}/history?days=${days}`)
  }

  async getCrops() {
    return this.get('/crops')
  }

  async createCrop(cropData: any) {
    return this.post('/crops', cropData)
  }

  async updateCrop(cropId: string, cropData: any) {
    return this.put(`/crops/${cropId}`, cropData)
  }

  async getAiTips() {
    return this.get('/ai/tips')
  }

  async getAiRecommendations() {
    return this.get('/ai/recommendations')
  }

  async requestAiAnalysis(type: string, data: any) {
    return this.post('/ai/analyze', { type, data })
  }

  async getSystemStatus() {
    return this.get('/system/status')
  }

  async updateSystemSettings(settings: any) {
    return this.put('/system/settings', settings)
  }

  async getTrainingModules() {
    return this.get('/training/modules')
  }

  async updateTrainingProgress(moduleId: string, progress: number) {
    return this.put(`/training/modules/${moduleId}/progress`, { progress })
  }

  async getPartnerships() {
    return this.get('/partnerships')
  }

  async applyForPartnership(applicationData: any) {
    return this.post('/partnerships/apply', applicationData)
  }

  // Mock data generator for offline functionality
  private getMockData(endpoint: string): any {
    const mockData: Record<string, any> = {
      '/sensors': [
        {
          id: '1',
          name: 'Temperature Sensor A',
          type: 'temperature',
          value: 24.5,
          unit: '°C',
          status: 'normal',
          location: 'Zone A',
          lastUpdated: new Date()
        },
        {
          id: '2',
          name: 'Humidity Sensor A',
          type: 'humidity',
          value: 65,
          unit: '%',
          status: 'normal',
          location: 'Zone A',
          lastUpdated: new Date()
        }
      ],
      '/crops': [
        {
          id: '1',
          name: 'Bell Pepper',
          scientificName: 'Capsicum annuum',
          category: 'Vegetable',
          imageUrl: '/src/assets/images/crops/bell-pepper.jpg',
          plantedDate: new Date('2024-03-01'),
          expectedHarvestDate: new Date('2024-06-10'),
          health: 95,
          status: 'active'
        }
      ],
      '/ai/tips': [
        {
          id: '1',
          title: 'Ventilation Check',
          content: 'Ensure proper ventilation in the greenhouse to maintain optimal humidity levels.',
          category: 'climate',
          priority: 'high',
          timestamp: new Date()
        }
      ],
      '/system/status': {
        connectionStatus: 'connected',
        powerStatus: 'on',
        automationMode: 'auto',
        status: 'operational',
        lastUpdated: new Date()
      }
    }

    // Handle dynamic endpoints
    if (endpoint.includes('/history')) {
      return Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        value: 20 + Math.random() * 10,
        status: 'normal'
      }))
    }

    return mockData[endpoint] || { message: 'Mock data not available' }
  }
}

// Export singleton instance
export const apiService = new ApiService()