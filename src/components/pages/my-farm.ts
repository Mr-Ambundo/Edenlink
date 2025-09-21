export default class MyFarmPage {
  private plantingHistory: any[] = []
  private suggestedPlants: any[] = []
  private currentPage = 1
  private itemsPerPage = 10
  private totalItems = 0
  private isLoading = true

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">My Farm</h1>
              <p class="text-gray-600 mt-1">Manage your planting history and discover recommended plants</p>
            </div>
            <div class="flex gap-3">
              <button class="btn-secondary">Edit Farm</button>
              <button class="btn-primary">Add Crop</button>
            </div>
          </div>
        </div>

        <!-- Farm Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Love Valley Farm</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">2</div>
              <div class="text-sm text-gray-600">Active Crops</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">85%</div>
              <div class="text-sm text-gray-600">Avg Health</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">45 days</div>
              <div class="text-sm text-gray-600">Next Harvest</div>
            </div>
          </div>
        </div>

        <!-- Currently Growing -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Currently Growing</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Coriander</h3>
                  <p class="text-sm text-gray-600">Planted: Apr 10, 2025</p>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Week 2</span>
              </div>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Health</span>
                    <span>85%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>45%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 45%"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Bell Peppers</h3>
                  <p class="text-sm text-gray-600">Planted: Apr 15, 2025</p>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Week 1</span>
              </div>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Health</span>
                    <span>95%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 95%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 65%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Planting History -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Planting History</h2>
            <button class="btn-secondary">Export History</button>
          </div>
          
          <div id="history-container">
            <!-- History content will be loaded here -->
          </div>
          
          <div id="pagination" class="flex justify-center mt-6">
            <!-- Pagination will be inserted here -->
          </div>
        </div>

        <!-- Suggested Plants -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Suggested Plants</h2>
          <p class="text-gray-600 mb-6">Based on your current farm conditions</p>
          
          <div id="suggested-plants" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Suggested plants will be loaded here -->
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
    this.isLoading = true
    
    // Mock planting history data
    this.plantingHistory = [
      {
        id: 'history1',
        plantName: 'Cherry Tomatoes',
        plantingDate: new Date('2024-01-15'),
        harvestDate: new Date('2024-04-15'),
        status: 'completed',
        yield: 5,
        yieldUnit: 'kg',
        notes: 'Good yield, but some pest issues noted.'
      },
      {
        id: 'history2',
        plantName: 'Basil',
        plantingDate: new Date('2024-02-01'),
        harvestDate: new Date('2024-04-01'),
        status: 'completed',
        yield: 2,
        yieldUnit: 'kg',
        notes: 'Excellent growth, no issues.'
      },
      {
        id: 'history3',
        plantName: 'Lettuce',
        plantingDate: new Date('2024-02-15'),
        harvestDate: new Date('2024-04-01'),
        status: 'completed',
        yield: 3,
        yieldUnit: 'kg',
        notes: 'Some issues with nutrient levels.'
      }
    ]

    // Mock suggested plants data
    this.suggestedPlants = [
      {
        id: 'spinach',
        name: 'Spinach',
        scientificName: 'Spinacia oleracea',
        imageUrl: '/assets/images/spinach.jpg',
        idealTemperature: 18,
        idealHumidity: 65,
        idealLight: 15000,
        aiSuggestion: 'Perfect for your current soil conditions and climate.'
      },
      {
        id: 'kale',
        name: 'Kale',
        scientificName: 'Brassica oleracea',
        imageUrl: '/assets/images/kale.jpg',
        idealTemperature: 16,
        idealHumidity: 60,
        idealLight: 14000,
        aiSuggestion: 'Excellent choice for winter growing season.'
      },
      {
        id: 'arugula',
        name: 'Arugula',
        scientificName: 'Eruca vesicaria',
        imageUrl: '/assets/images/arugula.jpg',
        idealTemperature: 20,
        idealHumidity: 55,
        idealLight: 12000,
        aiSuggestion: 'Fast-growing crop ideal for quick harvests.'
      }
    ]

    this.totalItems = this.plantingHistory.length
    this.isLoading = false
    
    this.renderHistory()
    this.renderSuggestedPlants()
    this.renderPagination()
  }

  private renderHistory(): void {
    const container = document.getElementById('history-container')
    if (!container) return

    if (this.isLoading) {
      container.innerHTML = `
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      `
      return
    }

    if (this.plantingHistory.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-4">🌱</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Planting History Yet</h3>
          <p class="text-gray-600 mb-4">Start by adding your first plant to track its growth journey.</p>
          <button class="btn-primary">Add First Plant</button>
        </div>
      `
      return
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    const pageHistory = this.plantingHistory.slice(startIndex, endIndex)

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planting Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harvest Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${pageHistory.map(record => `
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${record.plantName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.plantingDate.toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.harvestDate.toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }">
                    ${record.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.yield} ${record.yieldUnit}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-primary-600 hover:text-primary-900 mr-3">View</button>
                  <button class="text-gray-600 hover:text-gray-900">Edit</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  }

  private renderSuggestedPlants(): void {
    const container = document.getElementById('suggested-plants')
    if (!container) return

    container.innerHTML = this.suggestedPlants.map(plant => `
      <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <span class="text-4xl">🌿</span>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${plant.name}</h3>
          <p class="text-sm text-gray-600 mb-3">${plant.scientificName}</p>
          
          <div class="flex justify-between text-sm text-gray-600 mb-3">
            <div class="flex items-center">
              <span class="mr-1">🌡️</span>
              <span>${plant.idealTemperature}°C</span>
            </div>
            <div class="flex items-center">
              <span class="mr-1">💧</span>
              <span>${plant.idealHumidity}%</span>
            </div>
            <div class="flex items-center">
              <span class="mr-1">☀️</span>
              <span>${plant.idealLight} lux</span>
            </div>
          </div>
          
          <div class="bg-green-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-green-700">${plant.aiSuggestion}</p>
          </div>
          
          <button class="w-full btn-secondary">View Details</button>
        </div>
      </div>
    `).join('')
  }

  private renderPagination(): void {
    const container = document.getElementById('pagination')
    if (!container) return

    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    
    if (totalPages <= 1) {
      container.innerHTML = ''
      return
    }

    container.innerHTML = `
      <div class="flex items-center space-x-2">
        <button 
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
          ${this.currentPage === 1 ? 'disabled' : ''}
          onclick="this.changePage(${this.currentPage - 1})"
        >
          Previous
        </button>
        
        <span class="px-3 py-2 text-sm text-gray-700">
          Page ${this.currentPage} of ${totalPages}
        </span>
        
        <button 
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
          ${this.currentPage === totalPages ? 'disabled' : ''}
          onclick="this.changePage(${this.currentPage + 1})"
        >
          Next
        </button>
      </div>
    `
  }

  private changePage(page: number): void {
    if (page < 1 || page > Math.ceil(this.totalItems / this.itemsPerPage)) return
    
    this.currentPage = page
    this.renderHistory()
    this.renderPagination()
  }

  private setupEventListeners(): void {
    // Add event listeners for buttons and interactions
    const exportBtn = document.querySelector('[data-action="export"]')
    exportBtn?.addEventListener('click', () => this.exportHistory())
  }

  private exportHistory(): void {
    const data = JSON.stringify(this.plantingHistory, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `planting-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}