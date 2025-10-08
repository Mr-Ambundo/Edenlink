import { Chart, registerables } from 'chart.js'
import { apiService } from '../../services/ApiService'
import { socketService } from '../../services/SocketService'
import type { Sensor, Crop, SystemStatus } from '../../types'

// Register Chart.js components
Chart.register(...registerables)

export default class DashboardPage {
  private sensors: Sensor[] = []
  private crops: Crop[] = []
  private systemStatus: SystemStatus | null = null
  private chart: Chart | null = null
  private updateInterval: number | null = null

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600 mt-1">Monitor your farm's real-time data and system status</p>
          </div>
          <div class="flex gap-3">
            <button id="export-btn" class="btn-secondary">
              <i class="fas fa-download mr-2"></i>
              Export Data
            </button>
            <button id="refresh-btn" class="btn-primary">
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>
        </div>

        <!-- System Status Alert -->
        <div id="system-alert" class="hidden bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700" id="alert-message"></p>
            </div>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div id="metrics-container">
            <!-- Metric cards will be inserted here -->
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Real-time Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Real-time Sensor Data</h2>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-gray-500">Live</span>
              </div>
            </div>
            <div class="relative h-80">
              <canvas id="sensor-chart"></canvas>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            <div id="system-status" class="space-y-4">
              <!-- System status will be inserted here -->
            </div>
          </div>
        </div>

        <!-- Active Crops -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Active Crop Cycles</h2>
          <div id="crops-container" class="space-y-4">
            <!-- Crop cards will be inserted here -->
          </div>
        </div>

        <!-- AI Recommendations -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">AI Recommendations</h2>
            <button id="get-ai-tips" class="btn-outline">
              <i class="fas fa-robot mr-2"></i>
              Get AI Tips
            </button>
          </div>
          <div id="ai-recommendations" class="space-y-3">
            <!-- AI recommendations will be inserted here -->
          </div>
        </div>
      </div>
    `

    return container
  }

  mounted(): void {
    this.loadData()
    this.setupEventListeners()
    this.startRealTimeUpdates()
    this.initializeChart()
  }

  private async loadData(): Promise<void> {
    try {
      // Load sensors
      const sensorsResponse = await apiService.getSensors()
      if (sensorsResponse.success) {
        this.sensors = sensorsResponse.data as Sensor[]
        this.renderMetrics()
      }

      // Load crops
      const cropsResponse = await apiService.getCrops()
      if (cropsResponse.success) {
        this.crops = cropsResponse.data as Crop[]
        this.renderCrops()
      }

      // Load system status
      const statusResponse = await apiService.getSystemStatus()
      if (statusResponse.success) {
        this.systemStatus = statusResponse.data as SystemStatus
        this.renderSystemStatus()
      }

      // Load AI recommendations
      this.loadAiRecommendations()

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      this.showAlert('Failed to load some dashboard data. Using cached information.', 'warning')
    }
  }

  private renderMetrics(): void {
    const container = document.getElementById('metrics-container')
    if (!container) return

    container.innerHTML = this.sensors.map(sensor => `
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">${sensor.name}</p>
            <p class="text-2xl font-bold text-gray-900">${sensor.value} ${sensor.unit}</p>
          </div>
          <div class="text-3xl ${this.getStatusColor(sensor.status)}">
            ${this.getSensorIcon(sensor.type)}
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <div class="w-2 h-2 rounded-full mr-2 ${this.getStatusDotColor(sensor.status)}"></div>
            <span class="text-sm text-gray-500 capitalize">${sensor.status}</span>
          </div>
        </div>
      </div>
    `).join('')
  }

  private renderSystemStatus(): void {
    const container = document.getElementById('system-status')
    if (!container || !this.systemStatus) return

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-700">Connection</span>
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
            this.systemStatus.connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }">
            ${this.systemStatus.connectionStatus}
          </span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-700">Power</span>
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
            this.systemStatus.powerStatus === 'on' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }">
            ${this.systemStatus.powerStatus}
          </span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-700">Mode</span>
          <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            ${this.systemStatus.automationMode}
          </span>
        </div>
        ${this.systemStatus.message ? `
          <div class="p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700">${this.systemStatus.message}</p>
          </div>
        ` : ''}
      </div>
    `
  }

  private renderCrops(): void {
    const container = document.getElementById('crops-container')
    if (!container) return

    if (this.crops.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <i class="fas fa-seedling text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">No active crops found</p>
          <button class="btn-primary mt-4" onclick="window.router?.navigate('/my-farm')">
            Add Your First Crop
          </button>
        </div>
      `
      return
    }

    container.innerHTML = this.crops.map(crop => `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${crop.name}</h3>
            <p class="text-sm text-gray-600">${crop.scientificName}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                Planted: ${new Date(crop.plantedDate).toLocaleDateString()}
              </span>
              <span class="text-sm text-gray-500">
                Expected Harvest: ${new Date(crop.expectedHarvestDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-600">${crop.health}%</div>
            <div class="text-sm text-gray-500">Health</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Current Stage: ${crop.currentStage.name}</span>
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              ${crop.status}
            </span>
          </div>
          ${crop.aiSuggestion ? `
            <div class="mt-3 p-3 bg-green-50 rounded-lg">
              <div class="flex items-start">
                <i class="fas fa-robot text-green-600 mt-0.5 mr-2"></i>
                <p class="text-sm text-green-700">${crop.aiSuggestion}</p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('')
  }

  private async loadAiRecommendations(): Promise<void> {
    try {
      const response = await apiService.getAiRecommendations()
      if (response.success) {
        this.renderAiRecommendations(response.data as any[])
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error)
    }
  }

  private renderAiRecommendations(recommendations: unknown[]): void {
    const container = document.getElementById('ai-recommendations')
    if (!container) return

    if (recommendations.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6">
          <i class="fas fa-robot text-3xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">No AI recommendations available</p>
        </div>
      `
      return
    }

    container.innerHTML = (recommendations as any[]).map((rec: any) => `
      <div class="flex items-start p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0">
          <i class="fas fa-lightbulb text-yellow-500 text-lg"></i>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm text-gray-800">${rec.message}</p>
          <div class="mt-2 flex items-center justify-between">
            <span class="px-2 py-1 text-xs font-medium rounded-full ${
              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">
              ${rec.priority} priority
            </span>
            <span class="text-xs text-gray-500">${rec.category}</span>
          </div>
        </div>
      </div>
    `).join('')
  }

  private initializeChart(): void {
    const canvas = document.getElementById('sensor-chart') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Generate mock time series data
    const labels = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (11 - i) * 5)
      return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    })

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: Array.from({ length: 12 }, () => 20 + Math.random() * 8),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Humidity (%)',
            data: Array.from({ length: 12 }, () => 50 + Math.random() * 30),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Light (lux/100)',
            data: Array.from({ length: 12 }, () => 3 + Math.random() * 4),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    })
  }

  private setupEventListeners(): void {
    // Export button
    const exportBtn = document.getElementById('export-btn')
    exportBtn?.addEventListener('click', () => this.exportData())

    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn')
    refreshBtn?.addEventListener('click', () => this.refreshData())

    // AI tips button
    const aiTipsBtn = document.getElementById('get-ai-tips')
    aiTipsBtn?.addEventListener('click', () => this.getAiTips())
  }

  private startRealTimeUpdates(): void {
    // Update chart data every 5 seconds
    this.updateInterval = window.setInterval(() => {
      this.updateChartData()
    }, 5000)

    // Listen for socket events
    socketService.on('sensor_update', this.handleSensorUpdate)

    socketService.on('ai_recommendation', this.handleAiRecommendation)
  }

  private updateChartData(): void {
    if (!this.chart) return

    // Add new data point
    const now = new Date()
    const timeLabel = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    
    this.chart.data.labels?.push(timeLabel)
    this.chart.data.datasets.forEach((dataset, index) => {
      let newValue: number
      switch (index) {
        case 0: // Temperature
          newValue = 20 + Math.random() * 8
          break
        case 1: // Humidity
          newValue = 50 + Math.random() * 30
          break
        case 2: // Light
          newValue = 3 + Math.random() * 4
          break
        default:
          newValue = Math.random() * 100
      }
      dataset.data.push(newValue)
    })

    // Keep only last 12 data points
    if (this.chart.data.labels && this.chart.data.labels.length > 12) {
      this.chart.data.labels.shift()
      this.chart.data.datasets.forEach(dataset => {
        dataset.data.shift()
      })
    }

    this.chart.update('none')
  }

  private handleSensorUpdate = (data: { sensorId: string; [key: string]: any }): void => {
    // Update sensor data in real-time
    const sensorIndex = this.sensors.findIndex(s => s.id === data.sensorId)
    if (sensorIndex !== -1) {
      this.sensors[sensorIndex] = { ...this.sensors[sensorIndex], ...data }
      this.renderMetrics()
    }
  }

  private handleAiRecommendation = (data: { message: string }): void => {
    // Show new AI recommendation
    this.showAlert(`New AI Recommendation: ${data.message}`, 'info')
  }

  private async refreshData(): Promise<void> {
    const refreshBtn = document.getElementById('refresh-btn')
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Refreshing...'
    }

    await this.loadData()

    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Refresh'
    }
  }

  private async exportData(): Promise<void> {
    try {
      const data = {
        sensors: this.sensors,
        crops: this.crops,
        systemStatus: this.systemStatus,
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eden-link-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      this.showAlert('Data exported successfully!', 'success')
    } catch (error) {
      console.error('Export failed:', error)
      this.showAlert('Failed to export data', 'error')
    }
  }

  private async getAiTips(): Promise<void> {
    const button = document.getElementById('get-ai-tips')
    if (button) {
      button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Getting Tips...'
    }

    try {
      // Navigate to AI tips page
      const router = (window as any).router
      if (router) {
        router.navigate('/ai-tips')
      }
    } catch (error) {
      console.error('Failed to get AI tips:', error)
      this.showAlert('Failed to load AI tips', 'error')
    } finally {
      if (button) {
        button.innerHTML = '<i class="fas fa-robot mr-2"></i>Get AI Tips'
      }
    }
  }

  private showAlert(message: string, type: 'success' | 'warning' | 'error' | 'info'): void {
    const alert = document.getElementById('system-alert')
    const messageEl = document.getElementById('alert-message')
    
    if (alert && messageEl) {
      messageEl.textContent = message
      alert.className = `p-4 rounded-lg border-l-4 ${
        type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
        type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
        type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
        'bg-blue-50 border-blue-400 text-blue-700'
      }`
      alert.classList.remove('hidden')
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        alert.classList.add('hidden')
      }, 5000)
    }
  }

  private getSensorIcon(type: string): string {
    const icons: Record<string, string> = {
      temperature: '🌡️',
      humidity: '💧',
      light: '☀️',
      ec: '⚡',
      ph: '🧪',
      co2: '🌬️'
    }
    return icons[type] || '📊'
  }

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      normal: 'text-green-500',
      warning: 'text-yellow-500',
      alert: 'text-red-500'
    }
    return colors[status] || 'text-gray-500'
  }

  private getStatusDotColor(status: string): string {
    const colors: Record<string, string> = {
      normal: 'bg-green-500',
      warning: 'bg-yellow-500',
      alert: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  // Cleanup method
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    if (this.chart) {
      this.chart.destroy()
    }
    // Remove socket listeners
    socketService.off('sensor_update', this.handleSensorUpdate)
    socketService.off('ai_recommendation', this.handleAiRecommendation)
  }
}