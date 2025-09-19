import { User, Sensor, Crop, AiTip, Notification, SystemStatus, TrainingModule } from '@types/index'

export class AppStore {
  private data: Map<string, any> = new Map()
  private listeners: Map<string, Function[]> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  init() {
    // Initialize with default data if empty
    if (!this.get('user')) {
      this.initializeDefaultData()
    }
  }

  private initializeDefaultData() {
    // Default user
    this.set('user', {
      id: '1',
      name: 'John Farmer',
      email: 'john@edenlink.com',
      role: 'farmer',
      preferences: {
        theme: 'light',
        notifications: true,
        emailAlerts: true,
        pushNotifications: true,
        temperatureUnit: 'celsius',
        language: 'en'
      }
    })

    // Default sensors
    this.set('sensors', [
      {
        id: '1',
        name: 'Temperature Sensor A',
        type: 'temperature',
        value: 24.5,
        unit: '°C',
        status: 'normal',
        location: 'Zone A',
        lastUpdated: new Date(),
        minThreshold: 18,
        maxThreshold: 28
      },
      {
        id: '2',
        name: 'Humidity Sensor A',
        type: 'humidity',
        value: 65,
        unit: '%',
        status: 'normal',
        location: 'Zone A',
        lastUpdated: new Date(),
        minThreshold: 50,
        maxThreshold: 80
      },
      {
        id: '3',
        name: 'Light Sensor A',
        type: 'light',
        value: 650,
        unit: 'lux',
        status: 'normal',
        location: 'Zone A',
        lastUpdated: new Date(),
        minThreshold: 400,
        maxThreshold: 1000
      }
    ])

    // Default crops
    this.set('crops', [
      {
        id: '1',
        name: 'Bell Pepper',
        scientificName: 'Capsicum annuum',
        category: 'Vegetable',
        imageUrl: '/src/assets/images/crops/bell-pepper.jpg',
        plantedDate: new Date('2024-03-01'),
        expectedHarvestDate: new Date('2024-06-10'),
        currentStage: {
          id: 'stage-3',
          name: 'Flowering',
          order: 3,
          description: 'Plants are developing flowers',
          startDate: new Date('2024-04-15'),
          isCompleted: false,
          requiredActions: ['Monitor temperature', 'Ensure pollination']
        },
        health: 95,
        status: 'active',
        aiSuggestion: 'Growth is on track. Consider increasing pollination activities.'
      }
    ])

    // Default notifications
    this.set('notifications', [
      {
        id: '1',
        message: 'Temperature alert: Greenhouse 1 above optimal range',
        type: 'alert',
        time: '5 minutes ago',
        read: false
      },
      {
        id: '2',
        message: 'Coriander growth phase: Ready for harvest',
        type: 'success',
        time: '1 hour ago',
        read: false
      }
    ])

    // Default system status
    this.set('systemStatus', {
      connectionStatus: 'connected',
      powerStatus: 'on',
      automationMode: 'auto',
      pumps: [
        { id: 'pump1', name: 'Main Pump', status: 'active', flowRate: 2.5 },
        { id: 'pump2', name: 'Nutrient Pump A', status: 'inactive', flowRate: 1.0 }
      ],
      lastUpdated: new Date(),
      status: 'operational',
      message: 'All systems running normally'
    })

    // Default training modules
    this.set('trainingModules', [
      {
        id: '1',
        title: 'Soil Preparation',
        description: 'Learn how to prepare soil for planting.',
        duration: '30 mins',
        progress: 0,
        completed: false,
        lessons: []
      },
      {
        id: '2',
        title: 'Irrigation Techniques',
        description: 'Understand efficient irrigation methods.',
        duration: '45 mins',
        progress: 0,
        completed: false,
        lessons: []
      }
    ])

    this.saveToStorage()
  }

  // Get data
  get<T>(key: string): T | null {
    return this.data.get(key) || null
  }

  // Set data
  set<T>(key: string, value: T): void {
    this.data.set(key, value)
    this.saveToStorage()
    this.notify(key, value)
  }

  // Update data
  update<T>(key: string, updater: (current: T) => T): void {
    const current = this.get<T>(key)
    if (current !== null) {
      const updated = updater(current)
      this.set(key, updated)
    }
  }

  // Subscribe to changes
  subscribe(key: string, callback: Function): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    this.listeners.get(key)!.push(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  // Notify listeners
  private notify(key: string, value: any): void {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach(callback => callback(value))
    }
  }

  // Persistence
  private saveToStorage(): void {
    try {
      const dataObj = Object.fromEntries(this.data)
      localStorage.setItem('eden-link-data', JSON.stringify(dataObj, (key, value) => {
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() }
        }
        return value
      }))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('eden-link-data')
      if (stored) {
        const parsed = JSON.parse(stored, (key, value) => {
          if (value && value.__type === 'Date') {
            return new Date(value.value)
          }
          return value
        })
        this.data = new Map(Object.entries(parsed))
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  }

  // Clear all data
  clear(): void {
    this.data.clear()
    localStorage.removeItem('eden-link-data')
  }

  // Export data
  export(): string {
    const dataObj = Object.fromEntries(this.data)
    return JSON.stringify(dataObj, null, 2)
  }

  // Import data
  import(jsonData: string): void {
    try {
      const parsed = JSON.parse(jsonData)
      this.data = new Map(Object.entries(parsed))
      this.saveToStorage()
    } catch (error) {
      console.error('Failed to import data:', error)
      throw new Error('Invalid data format')
    }
  }
}