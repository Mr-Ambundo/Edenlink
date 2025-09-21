import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

export default class LogisticsPage {
  private systemStatus: any = null
  private nutrientLevels: any[] = []
  private waterLevel: any = null
  private isLoading = true
  private isAutoMode = true
  private waterChart: Chart | null = null
  private nutrientChart: Chart | null = null

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Logistics Panel</h1>
          <p class="text-gray-600 mt-1">Monitor and control your system's water, nutrients, and equipment status</p>
        </div>

        <!-- Loading State -->
        <div id="loading-container" class="text-center py-12" style="display: none;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading logistics data...</p>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">System Status</h2>
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600" id="mode-label">Auto Mode</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="automation-toggle" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div id="system-status-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- System status items will be inserted here -->
          </div>
        </div>

        <!-- Resource Levels -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Water Level -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Water Level</h2>
              <button id="refill-water" class="btn-secondary">Refill Water</button>
            </div>
            <div id="water-level-display">
              <!-- Water level display will be inserted here -->
            </div>
          </div>

          <!-- Nutrient Levels -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Nutrient Levels</h2>
            <div id="nutrient-levels-grid" class="space-y-4">
              <!-- Nutrient levels will be inserted here -->
            </div>
          </div>
        </div>

        <!-- Usage Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Water Usage Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Water Usage History</h2>
            <div class="relative h-80">
              <canvas id="water-chart"></canvas>
            </div>
          </div>

          <!-- Nutrient Usage Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Nutrient Usage History</h2>
            <div class="relative h-80">
              <canvas id="nutrient-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `

    return container
  }

  mounted(): void {
    this.loadData()
    this.setupEventListeners()
  }

  private async loadData(): Promise<void> {
    this.showLoading(true)

    // Mock system status
    this.systemStatus = {
      connectionStatus: 'connected',
      powerStatus: 'on',
      automationMode: 'auto',
      pumps: [
        { id: 'pump1', name: 'Main Pump', status: 'active', flowRate: 2.5 },
        { id: 'pump2', name: 'Nutrient Pump A', status: 'inactive', flowRate: 1.0 },
        { id: 'pump3', name: 'Nutrient Pump B', status: 'inactive', flowRate: 1.0 }
      ],
      lastUpdated: new Date(),
      status: 'operational',
      message: 'System running normally'
    }

    // Mock nutrient levels
    this.nutrientLevels = [
      {
        id: 'nutrient-a',
        name: 'Nutrient A',
        level: 750,
        percentage: 75,
        unit: 'ppm',
        status: 'normal',
        lastUpdated: new Date()
      },
      {
        id: 'nutrient-b',
        name: 'Nutrient B',
        level: 300,
        percentage: 30,
        unit: 'ppm',
        status: 'low',
        lastUpdated: new Date()
      }
    ]

    // Mock water level
    this.waterLevel = {
      current: 85,
      capacity: 100,
      percentage: 85,
      status: 'normal',
      lastUpdated: new Date()
    }

    this.showLoading(false)
    this.renderSystemStatus()
    this.renderWaterLevel()
    this.renderNutrientLevels()
    this.initializeCharts()
  }

  private showLoading(show: boolean): void {
    const loadingContainer = document.getElementById('loading-container')
    const mainContent = document.querySelectorAll('.bg-white')
    
    if (loadingContainer) {
      loadingContainer.style.display = show ? 'block' : 'none'
    }
    
    mainContent.forEach(element => {
      (element as HTMLElement).style.display = show ? 'none' : 'block'
    })
    
    this.isLoading = show
  }

  private renderSystemStatus(): void {
    const container = document.getElementById('system-status-grid')
    if (!container) return

    const statusItems = [
      {
        icon: '📡',
        label: 'Connection',
        value: this.systemStatus.connectionStatus,
        status: this.systemStatus.connectionStatus === 'connected' ? 'normal' : 'alert'
      },
      {
        icon: '⚡',
        label: 'Power',
        value: this.systemStatus.powerStatus,
        status: this.systemStatus.powerStatus === 'on' ? 'normal' : 'alert'
      },
      {
        icon: '🔄',
        label: 'Mode',
        value: this.systemStatus.automationMode,
        status: 'normal'
      },
      {
        icon: '✅',
        label: 'Status',
        value: this.systemStatus.status,
        status: this.systemStatus.status === 'operational' ? 'normal' : 'warning'
      }
    ]

    container.innerHTML = statusItems.map(item => `
      <div class="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 ${this.getStatusBorderColor(item.status)}">
        <div class="text-2xl mr-3">${item.icon}</div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-600">${item.label}</div>
          <div class="text-lg font-semibold text-gray-900 capitalize">${item.value}</div>
        </div>
      </div>
    `).join('')

    // Add pump status
    if (this.systemStatus.pumps && this.systemStatus.pumps.length > 0) {
      const pumpsHtml = this.systemStatus.pumps.map((pump: any) => `
        <div class="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 ${this.getStatusBorderColor(pump.status === 'active' ? 'normal' : 'warning')}">
          <div class="text-2xl mr-3">💧</div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-600">${pump.name}</div>
            <div class="text-lg font-semibold text-gray-900 capitalize">${pump.status}</div>
            ${pump.flowRate ? `<div class="text-xs text-gray-500">${pump.flowRate} L/min</div>` : ''}
          </div>
          <button class="btn-sm ${pump.status === 'active' ? 'btn-secondary' : 'btn-primary'}" 
                  onclick="this.togglePump('${pump.id}')">
            ${pump.status === 'active' ? 'Stop' : 'Start'}
          </button>
        </div>
      `).join('')
      
      container.innerHTML += pumpsHtml
    }
  }

  private renderWaterLevel(): void {
    const container = document.getElementById('water-level-display')
    if (!container) return

    const statusClass = this.getStatusClass(this.waterLevel.percentage)
    
    container.innerHTML = `
      <div class="text-center">
        <div class="relative w-32 h-32 mx-auto mb-4">
          <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path class="text-gray-300" stroke="currentColor" stroke-width="3" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="${statusClass}" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"
                  stroke-dasharray="${this.waterLevel.percentage}, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl font-bold text-gray-900">${this.waterLevel.percentage}%</span>
          </div>
        </div>
        <div class="text-sm text-gray-600">
          ${this.waterLevel.current}L / ${this.waterLevel.capacity}L
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Last updated: ${this.waterLevel.lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    `
  }

  private renderNutrientLevels(): void {
    const container = document.getElementById('nutrient-levels-grid')
    if (!container) return

    container.innerHTML = this.nutrientLevels.map(nutrient => `
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 ${this.getStatusBorderColor(nutrient.status)}">
        <div class="flex items-center">
          <div class="text-2xl mr-3">🧪</div>
          <div>
            <div class="font-medium text-gray-900">${nutrient.name}</div>
            <div class="text-sm text-gray-600">${nutrient.level} ${nutrient.unit} (${nutrient.percentage}%)</div>
          </div>
        </div>
        <button class="btn-secondary btn-sm" onclick="this.refillNutrient('${nutrient.id}')">
          Refill
        </button>
      </div>
    `).join('')
  }

  private initializeCharts(): void {
    this.initializeWaterChart()
    this.initializeNutrientChart()
  }

  private initializeWaterChart(): void {
    const canvas = document.getElementById('water-chart') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Generate mock data for the last 7 days
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString()
    })

    const waterUsageData = [45, 50, 48, 52, 49, 47, 51]

    this.waterChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Water Usage (L)',
          data: waterUsageData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Liters'
            }
          }
        }
      }
    })
  }

  private initializeNutrientChart(): void {
    const canvas = document.getElementById('nutrient-chart') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Generate mock data for the last 7 days
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString()
    })

    this.nutrientChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Nutrient A (mL)',
            data: [12, 15, 13, 14, 12, 11, 13],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Nutrient B (mL)',
            data: [10, 12, 11, 13, 11, 10, 12],
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Milliliters'
            }
          }
        }
      }
    })
  }

  private setupEventListeners(): void {
    // Automation toggle
    const automationToggle = document.getElementById('automation-toggle') as HTMLInputElement
    automationToggle?.addEventListener('change', () => this.toggleAutomationMode())

    // Refill water button
    const refillWaterBtn = document.getElementById('refill-water')
    refillWaterBtn?.addEventListener('click', () => this.refillWater())

    // Global click handler for pump and nutrient actions
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      
      // Handle pump toggle
      if (target.getAttribute('onclick')?.includes('togglePump')) {
        const pumpId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (pumpId) this.togglePump(pumpId)
      }
      
      // Handle nutrient refill
      if (target.getAttribute('onclick')?.includes('refillNutrient')) {
        const nutrientId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (nutrientId) this.refillNutrient(nutrientId)
      }
    })
  }

  private toggleAutomationMode(): void {
    this.isAutoMode = !this.isAutoMode
    const modeLabel = document.getElementById('mode-label')
    
    if (modeLabel) {
      modeLabel.textContent = this.isAutoMode ? 'Auto Mode' : 'Manual Mode'
    }

    // Update system status
    this.systemStatus.automationMode = this.isAutoMode ? 'auto' : 'manual'
    this.renderSystemStatus()
  }

  private togglePump(pumpId: string): void {
    const pump = this.systemStatus.pumps.find((p: any) => p.id === pumpId)
    if (pump) {
      pump.status = pump.status === 'active' ? 'inactive' : 'active'
      this.renderSystemStatus()
    }
  }

  private refillWater(): void {
    this.waterLevel.current = this.waterLevel.capacity
    this.waterLevel.percentage = 100
    this.waterLevel.status = 'normal'
    this.waterLevel.lastUpdated = new Date()
    
    this.renderWaterLevel()
    
    // Show success message
    this.showNotification('Water tank refilled successfully!', 'success')
  }

  private refillNutrient(nutrientId: string): void {
    const nutrient = this.nutrientLevels.find(n => n.id === nutrientId)
    if (nutrient) {
      nutrient.level = 1000
      nutrient.percentage = 100
      nutrient.status = 'normal'
      nutrient.lastUpdated = new Date()
      
      this.renderNutrientLevels()
      
      // Show success message
      this.showNotification(`${nutrient.name} refilled successfully!`, 'success')
    }
  }

  private getStatusClass(percentage: number): string {
    if (percentage <= 20) return 'text-red-500'
    if (percentage <= 40) return 'text-yellow-500'
    return 'text-green-500'
  }

  private getStatusBorderColor(status: string): string {
    switch (status) {
      case 'normal': return 'border-green-500'
      case 'warning': return 'border-yellow-500'
      case 'alert': return 'border-red-500'
      case 'low': return 'border-yellow-500'
      default: return 'border-gray-300'
    }
  }

  private showNotification(message: string, type: 'success' | 'warning' | 'error'): void {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-red-500 text-white'
    }`
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  // Cleanup method
  destroy(): void {
    if (this.waterChart) {
      this.waterChart.destroy()
    }
    if (this.nutrientChart) {
      this.nutrientChart.destroy()
    }
  }
}