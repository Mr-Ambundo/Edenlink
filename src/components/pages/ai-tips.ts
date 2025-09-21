export default class AiTipsPage {
  private tips: any[] = []
  private microclimateTips: any[] = []
  private healthTips: any[] = []
  private generalTips: any[] = []
  private isLoading = true
  private refreshingTips = false
  private lastSensorReadings: any = {}

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">AI-Powered Tips</h1>
            <p class="text-gray-600 mt-1">Custom insights based on your farm's microclimate and plant health data</p>
          </div>
          <button id="refresh-tips" class="btn-secondary">
            <span id="refresh-icon" class="mr-2">↻</span>
            <span id="refresh-text">Refresh Tips</span>
          </button>
        </div>

        <!-- Loading State -->
        <div id="loading-container" class="text-center py-12" style="display: none;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your farm data...</p>
        </div>

        <!-- Sensor Summary -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Current Conditions</h2>
          <div id="sensor-summary" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Sensor readings will be inserted here -->
          </div>
        </div>

        <!-- Microclimate Tips -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Microclimate Management</h2>
          <div id="microclimate-tips" class="space-y-4">
            <!-- Microclimate tips will be inserted here -->
          </div>
        </div>

        <!-- Plant Health Tips -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Plant Health</h2>
          <div id="health-tips" class="space-y-4">
            <!-- Health tips will be inserted here -->
          </div>
        </div>

        <!-- General Tips -->
        <div id="general-tips-section" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">General Farming Tips</h2>
          <div id="general-tips" class="space-y-4">
            <!-- General tips will be inserted here -->
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
    
    // Mock sensor readings
    this.lastSensorReadings = {
      temperature: { value: 24.5, unit: '°C', status: 'normal', minThreshold: 20, maxThreshold: 28 },
      humidity: { value: 65, unit: '%', status: 'normal', minThreshold: 50, maxThreshold: 80 },
      light: { value: 650, unit: 'lux', status: 'normal', minThreshold: 400, maxThreshold: 1000 },
      co2: { value: 420, unit: 'ppm', status: 'normal', minThreshold: 350, maxThreshold: 500 }
    }

    // Mock AI tips
    this.tips = [
      {
        id: '1',
        title: 'Ventilation Check',
        content: 'Ensure proper ventilation in the greenhouse to maintain optimal humidity levels.',
        category: 'climate',
        priority: 'high',
        timestamp: new Date(),
        recommendation: 'Increase ventilation during peak humidity hours',
        source: 'System Sensors',
        saved: false
      },
      {
        id: '2',
        title: 'Pest Management',
        content: 'Inspect plants for signs of pest infestation and apply organic pesticides if necessary.',
        category: 'health',
        priority: 'medium',
        timestamp: new Date(),
        recommendation: 'Apply neem oil solution if pests are found',
        source: 'Weekly Inspection',
        saved: false
      },
      {
        id: '3',
        title: 'Nutrient Balance',
        content: 'Your current nutrient levels are optimal. Continue with the current feeding schedule.',
        category: 'general',
        priority: 'low',
        timestamp: new Date(),
        source: 'AI Analysis',
        saved: false
      }
    ]

    this.categorizeTips()
    this.showLoading(false)
    this.renderSensorSummary()
    this.renderTips()
  }

  private categorizeTips(): void {
    this.microclimateTips = this.tips.filter(tip => tip.category === 'climate')
    this.healthTips = this.tips.filter(tip => tip.category === 'health')
    this.generalTips = this.tips.filter(tip => tip.category === 'general')
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

  private renderSensorSummary(): void {
    const container = document.getElementById('sensor-summary')
    if (!container) return

    const sensorData = [
      { name: 'Temperature', icon: '🌡️', key: 'temperature' },
      { name: 'Humidity', icon: '💧', key: 'humidity' },
      { name: 'Light', icon: '☀️', key: 'light' },
      { name: 'CO₂', icon: '🌬️', key: 'co2' }
    ]

    container.innerHTML = sensorData.map(sensor => {
      const reading = this.lastSensorReadings[sensor.key]
      if (!reading) return ''

      return `
        <div class="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 ${this.getStatusBorderColor(reading.status)}">
          <div class="text-2xl mr-3">${sensor.icon}</div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-600">${sensor.name}</div>
            <div class="text-lg font-semibold text-gray-900">${reading.value} ${reading.unit}</div>
          </div>
        </div>
      `
    }).join('')
  }

  private renderTips(): void {
    this.renderMicroclimateSection()
    this.renderHealthSection()
    this.renderGeneralSection()
  }

  private renderMicroclimateSection(): void {
    const container = document.getElementById('microclimate-tips')
    if (!container) return

    if (this.microclimateTips.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-4">🌈</div>
          <p class="text-gray-500">Your microclimate conditions look great! No adjustment tips at the moment.</p>
        </div>
      `
      return
    }

    container.innerHTML = this.microclimateTips.map(tip => this.renderTipCard(tip)).join('')
  }

  private renderHealthSection(): void {
    const container = document.getElementById('health-tips')
    if (!container) return

    if (this.healthTips.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-4">🌱</div>
          <p class="text-gray-500">Your plants appear healthy! No health issues detected.</p>
        </div>
      `
      return
    }

    container.innerHTML = this.healthTips.map(tip => this.renderTipCard(tip)).join('')
  }

  private renderGeneralSection(): void {
    const container = document.getElementById('general-tips')
    const section = document.getElementById('general-tips-section')
    
    if (!container || !section) return

    if (this.generalTips.length === 0) {
      section.style.display = 'none'
      return
    }

    section.style.display = 'block'
    container.innerHTML = this.generalTips.map(tip => this.renderTipCard(tip)).join('')
  }

  private renderTipCard(tip: any): string {
    return `
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between p-4 bg-gray-50 ${tip.priority === 'high' ? 'bg-yellow-50' : ''}">
          <div class="flex items-center">
            <span class="text-lg mr-3">${tip.priority === 'high' ? '⚠️' : '💡'}</span>
            <h3 class="font-semibold text-gray-900">${tip.title}</h3>
          </div>
          <div class="flex items-center space-x-2">
            <button class="text-gray-400 hover:text-yellow-500 ${tip.saved ? 'text-yellow-500' : ''}" 
                    onclick="this.saveTip('${tip.id}')" title="Save tip">
              ⭐
            </button>
            <button class="text-gray-400 hover:text-red-500" 
                    onclick="this.dismissTip('${tip.id}')" title="Dismiss tip">
              ✕
            </button>
          </div>
        </div>
        <div class="p-4">
          <p class="text-gray-700 mb-3">${tip.content}</p>
          ${tip.recommendation ? `
            <div class="bg-green-50 p-3 rounded-lg mb-3">
              <strong class="text-green-800">Recommendation:</strong>
              <span class="text-green-700"> ${tip.recommendation}</span>
            </div>
          ` : ''}
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>${tip.timestamp.toLocaleDateString()} ${tip.timestamp.toLocaleTimeString()}</span>
            <span>Based on ${tip.source}</span>
          </div>
        </div>
      </div>
    `
  }

  private setupEventListeners(): void {
    // Refresh tips button
    const refreshBtn = document.getElementById('refresh-tips')
    refreshBtn?.addEventListener('click', () => this.refreshTips())

    // Global click handler for tip actions
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      
      // Handle save tip
      if (target.getAttribute('onclick')?.includes('saveTip')) {
        const tipId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (tipId) this.saveTip(tipId)
      }
      
      // Handle dismiss tip
      if (target.getAttribute('onclick')?.includes('dismissTip')) {
        const tipId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (tipId) this.dismissTip(tipId)
      }
    })
  }

  private async refreshTips(): Promise<void> {
    this.refreshingTips = true
    const refreshIcon = document.getElementById('refresh-icon')
    const refreshText = document.getElementById('refresh-text')
    
    if (refreshIcon) refreshIcon.classList.add('animate-spin')
    if (refreshText) refreshText.textContent = 'Refreshing...'

    // Simulate API call
    setTimeout(() => {
      // Add a new tip to simulate refresh
      const newTip = {
        id: Date.now().toString(),
        title: 'Water Level Check',
        content: 'Monitor water levels in your hydroponic system to ensure consistent nutrient delivery.',
        category: 'general',
        priority: 'medium',
        timestamp: new Date(),
        source: 'System Monitor',
        saved: false
      }

      this.tips.unshift(newTip)
      this.categorizeTips()
      this.renderTips()

      this.refreshingTips = false
      if (refreshIcon) refreshIcon.classList.remove('animate-spin')
      if (refreshText) refreshText.textContent = 'Refresh Tips'
    }, 2000)
  }

  private saveTip(tipId: string): void {
    const tip = this.tips.find(t => t.id === tipId)
    if (tip) {
      tip.saved = !tip.saved
      this.renderTips()
    }
  }

  private dismissTip(tipId: string): void {
    this.tips = this.tips.filter(t => t.id !== tipId)
    this.categorizeTips()
    this.renderTips()
  }

  private getStatusBorderColor(status: string): string {
    switch (status) {
      case 'normal': return 'border-green-500'
      case 'warning': return 'border-yellow-500'
      case 'alert': return 'border-red-500'
      default: return 'border-gray-300'
    }
  }
}