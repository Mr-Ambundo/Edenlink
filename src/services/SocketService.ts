import { io, Socket } from 'socket.io-client'
import { SocketEvent } from '@types/index'

export class SocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventListeners: Map<string, Function[]> = new Map()

  async connect(url?: string): Promise<void> {
    const socketUrl = url || import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000'
    
    try {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      })

      this.setupEventHandlers()
      
      return new Promise((resolve, reject) => {
        if (!this.socket) return reject(new Error('Socket not initialized'))
        
        this.socket.on('connect', () => {
          console.log('🔌 Socket connected successfully')
          this.reconnectAttempts = 0
          resolve()
        })

        this.socket.on('connect_error', (error) => {
          console.warn('🔌 Socket connection failed, using mock data:', error.message)
          // Don't reject - fall back to mock data
          resolve()
        })
      })
    } catch (error) {
      console.warn('🔌 Socket service unavailable, using mock data:', error)
      // Don't throw - gracefully degrade to mock data
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Socket reconnected after ${attemptNumber} attempts`)
    })

    this.socket.on('reconnect_error', (error) => {
      console.warn('🔌 Socket reconnection failed:', error)
    })

    // Listen for sensor data updates
    this.socket.on('sensor_update', (data) => {
      this.emit('sensor_update', data)
    })

    // Listen for AI recommendations
    this.socket.on('ai_recommendation', (data) => {
      this.emit('ai_recommendation', data)
    })

    // Listen for system alerts
    this.socket.on('system_alert', (data) => {
      this.emit('system_alert', data)
    })

    // Listen for crop updates
    this.socket.on('crop_update', (data) => {
      this.emit('crop_update', data)
    })
  }

  // Event emitter functionality
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  // Send data to server
  send(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('🔌 Socket not connected, data not sent:', { event, data })
    }
  }

  // Request AI analysis
  requestAiAnalysis(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.socket.emit('ai_analysis_request', { type, data }, (response: any) => {
          if (response.success) {
            resolve(response.data)
          } else {
            reject(new Error(response.error))
          }
        })
      } else {
        // Fallback to mock AI response
        setTimeout(() => {
          resolve(this.getMockAiResponse(type, data))
        }, 1000)
      }
    })
  }

  // Subscribe to real-time sensor data
  subscribeSensorData(sensorIds: string[]): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_sensors', sensorIds)
    }
  }

  // Unsubscribe from sensor data
  unsubscribeSensorData(sensorIds: string[]): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe_sensors', sensorIds)
    }
  }

  // Send crop update
  updateCrop(cropData: any): void {
    this.send('crop_update', cropData)
  }

  // Send system command
  sendSystemCommand(command: string, params: any): void {
    this.send('system_command', { command, params })
  }

  private getMockAiResponse(type: string, data: any): any {
    const mockResponses = {
      crop_analysis: {
        health: 85,
        recommendations: [
          'Increase humidity by 5%',
          'Monitor for pest activity',
          'Consider nutrient adjustment'
        ],
        nextStage: 'Flowering',
        estimatedDays: 7
      },
      system_health: {
        status: 'good',
        issues: [],
        suggestions: [
          'All systems operating normally',
          'Regular maintenance recommended'
        ]
      },
      growth_prediction: {
        currentStage: 'Vegetation',
        progress: 65,
        expectedHarvest: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        yieldPrediction: '2.5kg'
      }
    }

    return mockResponses[type as keyof typeof mockResponses] || { message: 'Analysis complete' }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.eventListeners.clear()
  }

  get isConnected(): boolean {
    return this.socket?.connected || false
  }
}