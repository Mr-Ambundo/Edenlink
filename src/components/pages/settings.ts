export default class SettingsPage {
  private systemSettings: any = {}
  private monitoringSettings: any = {}
  private systemVersion: any = {}
  private isLoading = true

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">System Settings</h1>
            <p class="text-gray-600 mt-1">Configure your Eden Link system preferences and monitoring settings</p>
          </div>
          <div class="flex space-x-3">
            <button id="check-updates" class="btn-secondary">
              <span class="mr-2">🔄</span>
              Check for Updates
            </button>
            <button id="save-settings" class="btn-primary">
              <span class="mr-2">💾</span>
              Save Changes
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div id="loading-container" class="text-center py-12" style="display: none;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading settings...</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- System Information -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center mb-6">
              <span class="text-2xl mr-3">ℹ️</span>
              <h2 class="text-xl font-semibold text-gray-900">System Information</h2>
            </div>
            
            <div id="system-info" class="space-y-4">
              <!-- System info will be inserted here -->
            </div>
          </div>

          <!-- Notifications -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center mb-6">
              <span class="text-2xl mr-3">🔔</span>
              <h2 class="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="font-medium text-gray-900">Email Alerts</label>
                  <p class="text-sm text-gray-600">Receive important alerts via email</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="email-alerts" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="font-medium text-gray-900">Push Notifications</label>
                  <p class="text-sm text-gray-600">Get instant updates on your device</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="push-notifications" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="font-medium text-gray-900">SMS Alerts</label>
                  <p class="text-sm text-gray-600">Receive critical alerts via SMS</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="sms-alerts" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Data Management -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center mb-6">
              <span class="text-2xl mr-3">💾</span>
              <h2 class="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block font-medium text-gray-900 mb-2">Data Retention Period</label>
                <div class="flex items-center space-x-2">
                  <input type="number" id="retention-period" class="form-input flex-1" value="90" min="1" max="365">
                  <span class="text-gray-600">days</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="font-medium text-gray-900">Auto Backup</label>
                  <p class="text-sm text-gray-600">Automatically backup system data</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="auto-backup" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div>
                <label class="block font-medium text-gray-900 mb-2">Backup Frequency</label>
                <select id="backup-frequency" class="form-input">
                  <option value="daily">Daily</option>
                  <option value="weekly" selected>Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div class="flex space-x-3 pt-4">
                <button id="backup-now" class="btn-secondary flex-1">
                  <span class="mr-2">⬇️</span>
                  Backup Now
                </button>
                <button id="restore-backup" class="btn-secondary flex-1">
                  <span class="mr-2">⬆️</span>
                  Restore
                </button>
              </div>
            </div>
          </div>

          <!-- Monitoring Settings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center mb-6">
              <span class="text-2xl mr-3">📊</span>
              <h2 class="text-xl font-semibold text-gray-900">Monitoring Settings</h2>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block font-medium text-gray-900 mb-2">Sensor Polling Interval</label>
                <div class="flex items-center space-x-2">
                  <input type="number" id="polling-interval" class="form-input flex-1" value="30" min="5" max="300">
                  <span class="text-gray-600">seconds</span>
                </div>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-900 mb-4">Threshold Settings</h3>
                <div id="threshold-settings" class="space-y-4">
                  <!-- Threshold settings will be inserted here -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div id="message-container" class="fixed top-4 right-4 z-50" style="display: none;">
          <!-- Messages will be inserted here -->
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

    // Mock system settings
    this.systemSettings = {
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        smsAlerts: false
      },
      dataManagement: {
        dataRetentionPeriod: 90,
        autoBackup: true,
        backupFrequency: 'weekly'
      }
    }

    // Mock monitoring settings
    this.monitoringSettings = {
      sensorPollingInterval: 30,
      thresholds: {
        temperature: { min: 20, max: 30 },
        humidity: { min: 40, max: 70 },
        light: { min: 2000, max: 6000 },
        ec: { min: 1.0, max: 2.5 },
        ph: { min: 5.5, max: 6.5 }
      }
    }

    // Mock system version
    this.systemVersion = {
      current: '1.0.0',
      latest: '1.0.1',
      updateAvailable: true
    }

    this.showLoading(false)
    this.renderSystemInfo()
    this.renderThresholdSettings()
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

  private renderSystemInfo(): void {
    const container = document.getElementById('system-info')
    if (!container) return

    container.innerHTML = `
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span class="font-medium text-gray-700">Current Version</span>
        <span class="font-mono text-gray-900">${this.systemVersion.current}</span>
      </div>
      
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span class="font-medium text-gray-700">Latest Version</span>
        <span class="font-mono text-gray-900">${this.systemVersion.latest}</span>
      </div>
      
      ${this.systemVersion.updateAvailable ? `
        <div class="text-center p-3 bg-primary-50 rounded-lg">
          <span class="px-3 py-1 text-sm font-medium bg-primary-600 text-white rounded-full">
            Update Available
          </span>
        </div>
      ` : ''}
      
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span class="font-medium text-gray-700">System Status</span>
        <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Operational
        </span>
      </div>
      
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span class="font-medium text-gray-700">Last Backup</span>
        <span class="text-gray-900">${new Date().toLocaleDateString()}</span>
      </div>
    `
  }

  private renderThresholdSettings(): void {
    const container = document.getElementById('threshold-settings')
    if (!container) return

    const thresholds = [
      { key: 'temperature', name: 'Temperature', icon: '🌡️', unit: '°C' },
      { key: 'humidity', name: 'Humidity', icon: '💧', unit: '%' },
      { key: 'light', name: 'Light', icon: '☀️', unit: 'lux' },
      { key: 'ec', name: 'EC', icon: '⚡', unit: 'mS/cm' },
      { key: 'ph', name: 'pH', icon: '🧪', unit: '' }
    ]

    container.innerHTML = thresholds.map(threshold => {
      const settings = this.monitoringSettings.thresholds[threshold.key]
      return `
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center mb-3">
            <span class="text-lg mr-2">${threshold.icon}</span>
            <span class="font-medium text-gray-900">${threshold.name}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Min</label>
              <div class="flex items-center space-x-2">
                <input type="number" 
                       class="form-input flex-1" 
                       value="${settings.min}" 
                       step="${threshold.key === 'ph' || threshold.key === 'ec' ? '0.1' : '1'}"
                       data-threshold="${threshold.key}" 
                       data-type="min">
                <span class="text-sm text-gray-600">${threshold.unit}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Max</label>
              <div class="flex items-center space-x-2">
                <input type="number" 
                       class="form-input flex-1" 
                       value="${settings.max}" 
                       step="${threshold.key === 'ph' || threshold.key === 'ec' ? '0.1' : '1'}"
                       data-threshold="${threshold.key}" 
                       data-type="max">
                <span class="text-sm text-gray-600">${threshold.unit}</span>
              </div>
            </div>
          </div>
        </div>
      `
    }).join('')
  }

  private setupEventListeners(): void {
    // Save settings button
    const saveBtn = document.getElementById('save-settings')
    saveBtn?.addEventListener('click', () => this.saveSettings())

    // Check updates button
    const updateBtn = document.getElementById('check-updates')
    updateBtn?.addEventListener('click', () => this.checkForUpdates())

    // Backup buttons
    const backupBtn = document.getElementById('backup-now')
    const restoreBtn = document.getElementById('restore-backup')
    backupBtn?.addEventListener('click', () => this.backupSystem())
    restoreBtn?.addEventListener('click', () => this.restoreFromBackup())

    // Threshold input changes
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      if (target.dataset.threshold && target.dataset.type) {
        const threshold = target.dataset.threshold
        const type = target.dataset.type
        const value = parseFloat(target.value)
        
        if (!isNaN(value)) {
          this.monitoringSettings.thresholds[threshold][type] = value
        }
      }
    })

    // Other setting changes
    const pollingInterval = document.getElementById('polling-interval') as HTMLInputElement
    pollingInterval?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value)
      if (!isNaN(value)) {
        this.monitoringSettings.sensorPollingInterval = value
      }
    })

    const retentionPeriod = document.getElementById('retention-period') as HTMLInputElement
    retentionPeriod?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value)
      if (!isNaN(value)) {
        this.systemSettings.dataManagement.dataRetentionPeriod = value
      }
    })
  }

  private saveSettings(): void {
    // Collect all settings from form
    const emailAlerts = (document.getElementById('email-alerts') as HTMLInputElement).checked
    const pushNotifications = (document.getElementById('push-notifications') as HTMLInputElement).checked
    const smsAlerts = (document.getElementById('sms-alerts') as HTMLInputElement).checked
    const autoBackup = (document.getElementById('auto-backup') as HTMLInputElement).checked
    const backupFrequency = (document.getElementById('backup-frequency') as HTMLSelectElement).value

    // Update settings object
    this.systemSettings.notifications = {
      emailAlerts,
      pushNotifications,
      smsAlerts
    }

    this.systemSettings.dataManagement.autoBackup = autoBackup
    this.systemSettings.dataManagement.backupFrequency = backupFrequency

    // Mock save operation
    this.showMessage('Settings saved successfully!', 'success')
  }

  private checkForUpdates(): void {
    const button = document.getElementById('check-updates')
    if (button) {
      button.innerHTML = '<span class="mr-2">🔄</span>Checking...'
    }

    // Mock update check
    setTimeout(() => {
      if (this.systemVersion.updateAvailable) {
        this.showMessage('New update available: v1.0.2', 'info')
        this.systemVersion.latest = '1.0.2'
        this.renderSystemInfo()
      } else {
        this.showMessage('You are running the latest version', 'success')
      }

      if (button) {
        button.innerHTML = '<span class="mr-2">🔄</span>Check for Updates'
      }
    }, 2000)
  }

  private backupSystem(): void {
    const button = document.getElementById('backup-now')
    if (button) {
      button.innerHTML = '<span class="mr-2">⬇️</span>Backing up...'
    }

    // Mock backup operation
    setTimeout(() => {
      this.showMessage('System backup completed successfully!', 'success')
      
      if (button) {
        button.innerHTML = '<span class="mr-2">⬇️</span>Backup Now'
      }
    }, 3000)
  }

  private restoreFromBackup(): void {
    if (confirm('Are you sure you want to restore from the last backup? This will override current settings.')) {
      const button = document.getElementById('restore-backup')
      if (button) {
        button.innerHTML = '<span class="mr-2">⬆️</span>Restoring...'
      }

      // Mock restore operation
      setTimeout(() => {
        this.showMessage('System restored successfully!', 'success')
        this.loadData() // Reload settings after restore
        
        if (button) {
          button.innerHTML = '<span class="mr-2">⬆️</span>Restore'
        }
      }, 3000)
    }
  }

  private showMessage(message: string, type: 'success' | 'warning' | 'error' | 'info'): void {
    const container = document.getElementById('message-container')
    if (!container) return

    const messageEl = document.createElement('div')
    messageEl.className = `p-4 rounded-lg shadow-lg mb-2 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`
    messageEl.textContent = message

    container.appendChild(messageEl)
    container.style.display = 'block'

    // Remove after 3 seconds
    setTimeout(() => {
      container.removeChild(messageEl)
      if (container.children.length === 0) {
        container.style.display = 'none'
      }
    }, 3000)
  }
}