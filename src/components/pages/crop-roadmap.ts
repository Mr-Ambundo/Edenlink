export default class CropRoadmapPage {
  private currentCropCycle: any = null
  private cropTypes: any[] = []
  private showAiInsight = false
  private aiInsight = ''
  private loadingInsight = false

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Crop Cycle Roadmap</h1>
          <p class="text-gray-600 mt-1">Track your crop's growth stages and receive AI-powered insights</p>
        </div>

        <!-- Current Crop Cycle -->
        <div id="current-cycle" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <!-- Content will be loaded here -->
        </div>

        <!-- New Crop Form -->
        <div id="new-crop-form" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style="display: none;">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Start a New Crop Cycle</h2>
          <form id="crop-form" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
              <select id="crop-type" class="form-input" required>
                <option value="">Select a crop type</option>
                <option value="tomato">Tomato</option>
                <option value="lettuce">Lettuce</option>
                <option value="basil">Basil</option>
                <option value="spinach">Spinach</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Planting Date</label>
              <input type="date" id="plant-date" class="form-input" required>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cycle Duration (weeks)</label>
              <input type="number" id="cycle-duration" class="form-input" min="1" max="52" value="12" required>
            </div>
            
            <button type="submit" class="btn-primary">Start Tracking</button>
          </form>
        </div>

        <!-- AI Insight Modal -->
        <div id="ai-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">AI Growth Insight</h2>
              <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="p-6">
              <div class="flex items-start space-x-4">
                <div class="text-2xl">🤖</div>
                <div class="flex-1 bg-green-50 p-4 rounded-lg">
                  <div id="ai-insight-content">
                    <!-- AI insight content will be inserted here -->
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end p-6 border-t border-gray-200">
              <button id="close-modal-btn" class="btn-secondary">Close</button>
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
    // Mock current crop cycle
    this.currentCropCycle = {
      id: '1',
      cropName: 'Tomato',
      plantDate: new Date('2024-03-01'),
      currentStage: 2,
      status: 'active',
      durationWeeks: 12,
      stages: [
        {
          name: 'Seedling',
          startWeek: 1,
          endWeek: 2,
          description: 'Initial growth stage from seed to small plant',
          tasks: [
            { description: 'Monitor moisture', completed: true },
            { description: 'Maintain temperature', completed: true }
          ],
          completed: true
        },
        {
          name: 'Vegetative',
          startWeek: 3,
          endWeek: 6,
          description: 'Main growth phase',
          tasks: [
            { description: 'Regular pruning', completed: true },
            { description: 'Support installation', completed: false }
          ],
          completed: false
        },
        {
          name: 'Flowering',
          startWeek: 7,
          endWeek: 9,
          description: 'Flower development phase',
          tasks: [
            { description: 'Pollination', completed: false },
            { description: 'Nutrient adjustment', completed: false }
          ],
          completed: false
        },
        {
          name: 'Fruiting',
          startWeek: 10,
          endWeek: 12,
          description: 'Fruit development and ripening',
          tasks: [
            { description: 'Support maintenance', completed: false },
            { description: 'Harvest timing', completed: false }
          ],
          completed: false
        }
      ]
    }

    this.renderCurrentCycle()
  }

  private renderCurrentCycle(): void {
    const container = document.getElementById('current-cycle')
    if (!container) return

    if (!this.currentCropCycle) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-4">🌱</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Active Crop Cycle</h3>
          <p class="text-gray-600 mb-4">Start tracking a new crop to see its growth roadmap.</p>
          <button id="start-new-crop" class="btn-primary">Start New Crop</button>
        </div>
      `
      return
    }

    const currentWeek = this.getCurrentWeek()
    const progress = this.calculateProgress()

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Cycle Header -->
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">${this.currentCropCycle.cropName}</h2>
            <p class="text-gray-600">
              Planted on ${this.currentCropCycle.plantDate.toLocaleDateString()} • 
              Week ${currentWeek} of ${this.currentCropCycle.durationWeeks}
            </p>
          </div>
          <button id="get-ai-insight" class="btn-secondary">
            <span class="mr-2">🤖</span>
            AI Insight
          </button>
        </div>

        <!-- Progress Bar -->
        <div>
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>${progress}% complete</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-primary-600 h-3 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
        </div>

        <!-- Stages Timeline -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">Growth Stages</h3>
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            ${this.currentCropCycle.stages.map((stage: any, index: number) => `
              <div class="relative flex items-start space-x-4 pb-8">
                <!-- Stage marker -->
                <div class="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                  stage.completed ? 'bg-green-500 border-green-500' :
                  currentWeek >= stage.startWeek && currentWeek <= stage.endWeek ? 'bg-primary-600 border-primary-600' :
                  'bg-white border-gray-300'
                }">
                  <span class="text-sm font-semibold ${
                    stage.completed || (currentWeek >= stage.startWeek && currentWeek <= stage.endWeek) ? 'text-white' : 'text-gray-600'
                  }">
                    ${stage.completed ? '✓' : index + 1}
                  </span>
                </div>
                
                <!-- Stage content -->
                <div class="flex-1 min-w-0">
                  <div class="bg-white border border-gray-200 rounded-lg p-4 ${
                    currentWeek >= stage.startWeek && currentWeek <= stage.endWeek ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
                  }">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">${stage.name}</h4>
                      <span class="text-sm text-gray-500">Week ${stage.startWeek}-${stage.endWeek}</span>
                    </div>
                    <p class="text-gray-600 mb-4">${stage.description}</p>
                    
                    <div class="space-y-2">
                      <h5 class="text-sm font-semibold text-gray-900">Tasks:</h5>
                      ${stage.tasks.map((task: any) => `
                        <div class="flex items-center space-x-2">
                          <input type="checkbox" ${task.completed ? 'checked' : ''} 
                                 class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                 onchange="this.toggleTask('${stage.name}', '${task.description}')">
                          <span class="text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}">${task.description}</span>
                        </div>
                      `).join('')}
                    </div>
                    
                    ${!stage.completed && currentWeek >= stage.startWeek ? `
                      <div class="mt-4">
                        <button class="btn-secondary btn-sm" onclick="this.markStageComplete(${index})">
                          Mark Stage Complete
                        </button>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `
  }

  private getCurrentWeek(): number {
    if (!this.currentCropCycle) return 0
    
    const startDate = new Date(this.currentCropCycle.plantDate)
    const today = new Date()
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return Math.min(Math.ceil(daysPassed / 7), this.currentCropCycle.durationWeeks)
  }

  private calculateProgress(): number {
    if (!this.currentCropCycle) return 0
    
    const currentWeek = this.getCurrentWeek()
    return Math.min(Math.round((currentWeek / this.currentCropCycle.durationWeeks) * 100), 100)
  }

  private setupEventListeners(): void {
    // Start new crop button
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      
      if (target.id === 'start-new-crop') {
        this.showNewCropForm()
      }
      
      if (target.id === 'get-ai-insight') {
        this.getAiInsight()
      }
      
      if (target.id === 'close-modal' || target.id === 'close-modal-btn') {
        this.closeAiModal()
      }
    })

    // Form submission
    const form = document.getElementById('crop-form')
    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      this.submitNewCrop()
    })
  }

  private showNewCropForm(): void {
    const currentCycle = document.getElementById('current-cycle')
    const newCropForm = document.getElementById('new-crop-form')
    
    if (currentCycle) currentCycle.style.display = 'none'
    if (newCropForm) newCropForm.style.display = 'block'
  }

  private submitNewCrop(): void {
    const cropType = (document.getElementById('crop-type') as HTMLSelectElement).value
    const plantDate = (document.getElementById('plant-date') as HTMLInputElement).value
    const cycleDuration = (document.getElementById('cycle-duration') as HTMLInputElement).value

    if (!cropType || !plantDate || !cycleDuration) {
      alert('Please fill in all fields')
      return
    }

    // Create new crop cycle (mock)
    this.currentCropCycle = {
      id: Date.now().toString(),
      cropName: cropType.charAt(0).toUpperCase() + cropType.slice(1),
      plantDate: new Date(plantDate),
      currentStage: 0,
      status: 'active',
      durationWeeks: parseInt(cycleDuration),
      stages: this.generateStagesForCrop(cropType, parseInt(cycleDuration))
    }

    // Hide form and show cycle
    const currentCycle = document.getElementById('current-cycle')
    const newCropForm = document.getElementById('new-crop-form')
    
    if (currentCycle) currentCycle.style.display = 'block'
    if (newCropForm) newCropForm.style.display = 'none'

    this.renderCurrentCycle()
  }

  private generateStagesForCrop(cropType: string, durationWeeks: number): any[] {
    // Mock stage generation based on crop type
    const baseStages = [
      { name: 'Seedling', percentage: 0.15, description: 'Initial growth from seed' },
      { name: 'Vegetative', percentage: 0.35, description: 'Main growth phase' },
      { name: 'Flowering', percentage: 0.25, description: 'Flower development' },
      { name: 'Fruiting', percentage: 0.25, description: 'Fruit development and harvest' }
    ]

    let currentWeek = 1
    return baseStages.map(stage => {
      const stageDuration = Math.ceil(durationWeeks * stage.percentage)
      const stageStart = currentWeek
      const stageEnd = currentWeek + stageDuration - 1
      currentWeek = stageEnd + 1

      return {
        name: stage.name,
        startWeek: stageStart,
        endWeek: Math.min(stageEnd, durationWeeks),
        description: stage.description,
        tasks: [
          { description: `Monitor ${stage.name.toLowerCase()} development`, completed: false },
          { description: `Adjust nutrients for ${stage.name.toLowerCase()}`, completed: false }
        ],
        completed: false
      }
    })
  }

  private getAiInsight(): void {
    this.loadingInsight = true
    const button = document.getElementById('get-ai-insight')
    if (button) {
      button.innerHTML = '<span class="mr-2">🤖</span>Loading...'
    }

    // Mock AI insight
    setTimeout(() => {
      this.aiInsight = `Based on your current tomato crop in week ${this.getCurrentWeek()}, here are my recommendations:

• Your crop is progressing well and is on schedule for the vegetative stage
• Consider increasing nitrogen levels by 10% to support leaf development
• Monitor for early signs of pest activity as plants become more established
• Ensure adequate support structures are in place before the flowering stage
• Current environmental conditions are optimal for continued growth

Expected timeline: You should see flowering begin in approximately 2-3 weeks if current conditions are maintained.`

      this.showAiModal()
      this.loadingInsight = false
      
      if (button) {
        button.innerHTML = '<span class="mr-2">🤖</span>AI Insight'
      }
    }, 2000)
  }

  private showAiModal(): void {
    const modal = document.getElementById('ai-modal')
    const content = document.getElementById('ai-insight-content')
    
    if (content) {
      content.innerHTML = `<p class="text-gray-800 whitespace-pre-line">${this.aiInsight}</p>`
    }
    
    if (modal) {
      modal.style.display = 'flex'
    }
  }

  private closeAiModal(): void {
    const modal = document.getElementById('ai-modal')
    if (modal) {
      modal.style.display = 'none'
    }
  }

  private markStageComplete(stageIndex: number): void {
    if (this.currentCropCycle && this.currentCropCycle.stages[stageIndex]) {
      this.currentCropCycle.stages[stageIndex].completed = true
      this.currentCropCycle.stages[stageIndex].tasks.forEach((task: any) => {
        task.completed = true
      })
      this.renderCurrentCycle()
    }
  }
}