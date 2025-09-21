export default class TrainingPage {
  private trainingModules: any[] = []
  private isLoading = true

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Training Modules</h1>
          <p class="text-gray-600 mt-1">Learn essential farming techniques and best practices</p>
        </div>

        <!-- Loading State -->
        <div id="loading-container" class="text-center py-12" style="display: none;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading training modules...</p>
        </div>

        <!-- Progress Overview -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Your Progress</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600" id="completed-count">0</div>
              <div class="text-sm text-gray-600">Completed Modules</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600" id="in-progress-count">0</div>
              <div class="text-sm text-gray-600">In Progress</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-600" id="total-count">0</div>
              <div class="text-sm text-gray-600">Total Modules</div>
            </div>
          </div>
        </div>

        <!-- Training Modules -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Available Modules</h2>
            <div class="flex space-x-2">
              <button id="filter-all" class="btn-secondary btn-sm active">All</button>
              <button id="filter-beginner" class="btn-secondary btn-sm">Beginner</button>
              <button id="filter-intermediate" class="btn-secondary btn-sm">Intermediate</button>
              <button id="filter-advanced" class="btn-secondary btn-sm">Advanced</button>
            </div>
          </div>
          
          <div id="training-modules" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Training modules will be inserted here -->
          </div>
        </div>

        <!-- Achievements -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
          <div id="achievements" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Achievements will be inserted here -->
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

    // Mock training modules
    this.trainingModules = [
      {
        id: '1',
        title: 'Soil Preparation',
        description: 'Learn how to prepare soil for optimal plant growth and nutrient absorption.',
        duration: '30 mins',
        level: 'beginner',
        progress: 0,
        completed: false,
        lessons: 5,
        thumbnail: '🌱',
        category: 'Basics'
      },
      {
        id: '2',
        title: 'Irrigation Techniques',
        description: 'Master efficient irrigation methods for different types of crops and growing conditions.',
        duration: '45 mins',
        level: 'intermediate',
        progress: 60,
        completed: false,
        lessons: 7,
        thumbnail: '💧',
        category: 'Water Management'
      },
      {
        id: '3',
        title: 'Pest Management',
        description: 'Discover natural and organic pest control techniques to protect your crops.',
        duration: '40 mins',
        level: 'intermediate',
        progress: 100,
        completed: true,
        lessons: 6,
        thumbnail: '🐛',
        category: 'Plant Health'
      },
      {
        id: '4',
        title: 'Hydroponic Systems',
        description: 'Complete guide to setting up and maintaining hydroponic growing systems.',
        duration: '60 mins',
        level: 'advanced',
        progress: 25,
        completed: false,
        lessons: 10,
        thumbnail: '🔬',
        category: 'Advanced Techniques'
      },
      {
        id: '5',
        title: 'Nutrient Management',
        description: 'Understanding plant nutrition and creating optimal nutrient solutions.',
        duration: '50 mins',
        level: 'intermediate',
        progress: 0,
        completed: false,
        lessons: 8,
        thumbnail: '🧪',
        category: 'Plant Health'
      },
      {
        id: '6',
        title: 'Crop Rotation',
        description: 'Learn sustainable farming practices through effective crop rotation strategies.',
        duration: '35 mins',
        level: 'beginner',
        progress: 100,
        completed: true,
        lessons: 4,
        thumbnail: '🔄',
        category: 'Sustainability'
      }
    ]

    this.showLoading(false)
    this.renderProgressOverview()
    this.renderTrainingModules()
    this.renderAchievements()
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

  private renderProgressOverview(): void {
    const completedCount = this.trainingModules.filter(m => m.completed).length
    const inProgressCount = this.trainingModules.filter(m => m.progress > 0 && !m.completed).length
    const totalCount = this.trainingModules.length

    const completedEl = document.getElementById('completed-count')
    const inProgressEl = document.getElementById('in-progress-count')
    const totalEl = document.getElementById('total-count')

    if (completedEl) completedEl.textContent = completedCount.toString()
    if (inProgressEl) inProgressEl.textContent = inProgressCount.toString()
    if (totalEl) totalEl.textContent = totalCount.toString()
  }

  private renderTrainingModules(filter: string = 'all'): void {
    const container = document.getElementById('training-modules')
    if (!container) return

    let filteredModules = this.trainingModules
    if (filter !== 'all') {
      filteredModules = this.trainingModules.filter(m => m.level === filter)
    }

    container.innerHTML = filteredModules.map(module => `
      <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="text-4xl">${module.thumbnail}</div>
            <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getLevelBadgeClass(module.level)}">
              ${module.level}
            </span>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${module.title}</h3>
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">${module.description}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>${module.duration}</span>
            <span>${module.lessons} lessons</span>
          </div>
          
          ${module.progress > 0 ? `
            <div class="mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>${module.progress}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" style="width: ${module.progress}%"></div>
              </div>
            </div>
          ` : ''}
          
          <button class="w-full ${module.completed ? 'btn-secondary' : module.progress > 0 ? 'btn-primary' : 'btn-primary'}" 
                  onclick="this.startModule('${module.id}')">
            ${module.completed ? 'Review Module' : module.progress > 0 ? 'Continue Learning' : 'Start Training'}
          </button>
        </div>
      </div>
    `).join('')
  }

  private renderAchievements(): void {
    const container = document.getElementById('achievements')
    if (!container) return

    const achievements = [
      {
        id: 'first-module',
        title: 'First Steps',
        description: 'Complete your first training module',
        icon: '🎯',
        unlocked: this.trainingModules.some(m => m.completed)
      },
      {
        id: 'pest-expert',
        title: 'Pest Expert',
        description: 'Master pest management techniques',
        icon: '🛡️',
        unlocked: this.trainingModules.find(m => m.id === '3')?.completed || false
      },
      {
        id: 'hydro-master',
        title: 'Hydro Master',
        description: 'Complete advanced hydroponic training',
        icon: '💎',
        unlocked: this.trainingModules.find(m => m.id === '4')?.completed || false
      },
      {
        id: 'knowledge-seeker',
        title: 'Knowledge Seeker',
        description: 'Complete 5 training modules',
        icon: '📚',
        unlocked: this.trainingModules.filter(m => m.completed).length >= 5
      }
    ]

    container.innerHTML = achievements.map(achievement => `
      <div class="text-center p-4 rounded-lg ${achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}">
        <div class="text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}">${achievement.icon}</div>
        <h3 class="font-semibold text-gray-900 mb-1">${achievement.title}</h3>
        <p class="text-xs text-gray-600">${achievement.description}</p>
        ${achievement.unlocked ? `
          <div class="mt-2">
            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Unlocked</span>
          </div>
        ` : ''}
      </div>
    `).join('')
  }

  private setupEventListeners(): void {
    // Filter buttons
    const filterButtons = ['filter-all', 'filter-beginner', 'filter-intermediate', 'filter-advanced']
    filterButtons.forEach(buttonId => {
      const button = document.getElementById(buttonId)
      button?.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(id => {
          document.getElementById(id)?.classList.remove('active')
        })
        button.classList.add('active')
        
        // Apply filter
        const filter = buttonId.replace('filter-', '')
        this.renderTrainingModules(filter)
      })
    })

    // Global click handler for module actions
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      
      if (target.getAttribute('onclick')?.includes('startModule')) {
        const moduleId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (moduleId) this.startModule(moduleId)
      }
    })
  }

  private startModule(moduleId: string): void {
    const module = this.trainingModules.find(m => m.id === moduleId)
    if (!module) return

    // Mock module start - in a real app, this would navigate to the module content
    if (module.completed) {
      alert(`Reviewing "${module.title}" module. This would open the module content for review.`)
    } else if (module.progress > 0) {
      alert(`Continuing "${module.title}" module from ${module.progress}% progress.`)
    } else {
      alert(`Starting "${module.title}" module. This would begin the first lesson.`)
      
      // Simulate starting progress
      module.progress = 10
      this.renderTrainingModules()
      this.renderProgressOverview()
    }
  }

  private getLevelBadgeClass(level: string): string {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
}