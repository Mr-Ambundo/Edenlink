export default class PartnershipsPage {
  private currentPartners: any[] = []
  private collaborationOpportunities: any[] = []
  private isLoading = true

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gray-50 p-6'
    
    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Partnerships & Collaboration</h1>
            <p class="text-gray-600 mt-1">Connect with partners and explore collaboration opportunities</p>
          </div>
          <button id="request-partnership" class="btn-primary">Request Partnership</button>
        </div>

        <!-- Loading State -->
        <div id="loading-container" class="text-center py-12" style="display: none;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading partnership data...</p>
        </div>

        <!-- Current Partners -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Current Partners</h2>
          <div id="current-partners" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Current partners will be inserted here -->
          </div>
        </div>

        <!-- Collaboration Opportunities -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Collaboration Opportunities</h2>
          <div id="collaboration-opportunities" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Collaboration opportunities will be inserted here -->
          </div>
        </div>

        <!-- Partnership Benefits -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Partnership Benefits</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <div class="text-4xl mb-4">🤝</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Shared Resources</h3>
              <p class="text-gray-600 text-sm">Access to shared technology, research data, and farming expertise</p>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <div class="text-4xl mb-4">📈</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Market Access</h3>
              <p class="text-gray-600 text-sm">Expanded market reach and distribution networks</p>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <div class="text-4xl mb-4">🔬</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Research Collaboration</h3>
              <p class="text-gray-600 text-sm">Joint research projects and knowledge sharing</p>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <div class="text-4xl mb-4">🌱</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p class="text-gray-600 text-sm">Collective impact on sustainable farming practices</p>
            </div>
          </div>
        </div>

        <!-- Partnership Request Modal -->
        <div id="partnership-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Request Partnership</h2>
              <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form id="partnership-form" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input type="text" class="form-input" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Partnership Type</label>
                <select class="form-input" required>
                  <option value="">Select partnership type</option>
                  <option value="research">Research Collaboration</option>
                  <option value="technology">Technology Partnership</option>
                  <option value="distribution">Distribution Partnership</option>
                  <option value="supplier">Supplier Partnership</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea class="form-input" rows="4" placeholder="Describe your partnership proposal..." required></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input type="email" class="form-input" required>
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="cancel-request" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Submit Request</button>
              </div>
            </form>
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

    // Mock current partners
    this.currentPartners = [
      {
        id: '1',
        name: 'AgriTech Solutions',
        type: 'Technology Provider',
        description: 'Leading provider of smart farming solutions and IoT devices for agriculture.',
        logoUrl: '/assets/images/partners/agritech.png',
        projectCount: 3,
        partnerSince: new Date('2023-01-15')
      },
      {
        id: '2',
        name: 'Green Research Institute',
        type: 'Research Organization',
        description: 'Research institute focused on sustainable farming practices and crop optimization.',
        logoUrl: '/assets/images/partners/gri.png',
        projectCount: 2,
        partnerSince: new Date('2023-03-20')
      },
      {
        id: '3',
        name: 'FreshMarket Connect',
        type: 'Distribution Partner',
        description: 'Network of premium grocery stores and organic markets.',
        logoUrl: '/assets/images/partners/freshmarket.png',
        projectCount: 5,
        partnerSince: new Date('2023-02-01')
      }
    ]

    // Mock collaboration opportunities
    this.collaborationOpportunities = [
      {
        id: '1',
        title: 'Hydroponic Efficiency Study',
        type: 'research',
        description: 'Research project to optimize nutrient usage in hydroponic systems.',
        duration: '6 months',
        partnersNeeded: 2,
        deadline: new Date('2024-06-30')
      },
      {
        id: '2',
        title: 'Smart Monitoring Integration',
        type: 'technology',
        description: 'Integration of advanced IoT sensors for real-time crop monitoring.',
        duration: '3 months',
        partnersNeeded: 1,
        deadline: new Date('2024-05-15')
      },
      {
        id: '3',
        title: 'Local Market Expansion',
        type: 'distribution',
        description: 'Partnership opportunity for expanding distribution in the local market.',
        duration: '12 months',
        partnersNeeded: 3,
        deadline: new Date('2024-07-31')
      },
      {
        id: '4',
        title: 'Sustainable Packaging Initiative',
        type: 'research',
        description: 'Develop eco-friendly packaging solutions for fresh produce.',
        duration: '8 months',
        partnersNeeded: 4,
        deadline: new Date('2024-08-15')
      }
    ]

    this.showLoading(false)
    this.renderCurrentPartners()
    this.renderCollaborationOpportunities()
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

  private renderCurrentPartners(): void {
    const container = document.getElementById('current-partners')
    if (!container) return

    if (this.currentPartners.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8">
          <div class="text-4xl mb-4">🤝</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
          <p class="text-gray-600 mb-4">Start building partnerships to expand your farming network.</p>
          <button class="btn-primary" onclick="this.openPartnershipModal()">Find Partners</button>
        </div>
      `
      return
    }

    container.innerHTML = this.currentPartners.map(partner => `
      <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
            <span class="text-2xl">🏢</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${partner.name}</h3>
            <p class="text-sm text-gray-600">${partner.type}</p>
          </div>
        </div>
        
        <p class="text-gray-700 text-sm mb-4 line-clamp-3">${partner.description}</p>
        
        <div class="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div class="flex items-center">
            <span class="mr-1">📊</span>
            <span>${partner.projectCount} projects</span>
          </div>
          <div class="flex items-center">
            <span class="mr-1">📅</span>
            <span>Since ${partner.partnerSince.getFullYear()}</span>
          </div>
        </div>
        
        <button class="w-full btn-secondary" onclick="this.viewPartnerDetails('${partner.id}')">
          View Details
        </button>
      </div>
    `).join('')
  }

  private renderCollaborationOpportunities(): void {
    const container = document.getElementById('collaboration-opportunities')
    if (!container) return

    container.innerHTML = this.collaborationOpportunities.map(opportunity => `
      <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">${opportunity.title}</h3>
          <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getOpportunityTypeClass(opportunity.type)}">
            ${opportunity.type}
          </span>
        </div>
        
        <p class="text-gray-700 text-sm mb-4 line-clamp-3">${opportunity.description}</p>
        
        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex items-center">
            <span class="mr-2">⏱️</span>
            <span>Duration: ${opportunity.duration}</span>
          </div>
          <div class="flex items-center">
            <span class="mr-2">👥</span>
            <span>Partners Needed: ${opportunity.partnersNeeded}</span>
          </div>
          <div class="flex items-center">
            <span class="mr-2">📅</span>
            <span>Deadline: ${opportunity.deadline.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button class="flex-1 btn-primary" onclick="this.applyForOpportunity('${opportunity.id}')">
            Apply Now
          </button>
          <button class="flex-1 btn-secondary" onclick="this.learnMore('${opportunity.id}')">
            Learn More
          </button>
        </div>
      </div>
    `).join('')
  }

  private setupEventListeners(): void {
    // Partnership request button
    const requestBtn = document.getElementById('request-partnership')
    requestBtn?.addEventListener('click', () => this.openPartnershipModal())

    // Modal close buttons
    const closeBtn = document.getElementById('close-modal')
    const cancelBtn = document.getElementById('cancel-request')
    closeBtn?.addEventListener('click', () => this.closePartnershipModal())
    cancelBtn?.addEventListener('click', () => this.closePartnershipModal())

    // Partnership form
    const form = document.getElementById('partnership-form')
    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      this.submitPartnershipRequest()
    })

    // Global click handler for opportunity actions
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      
      if (target.getAttribute('onclick')?.includes('viewPartnerDetails')) {
        const partnerId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (partnerId) this.viewPartnerDetails(partnerId)
      }
      
      if (target.getAttribute('onclick')?.includes('applyForOpportunity')) {
        const opportunityId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (opportunityId) this.applyForOpportunity(opportunityId)
      }
      
      if (target.getAttribute('onclick')?.includes('learnMore')) {
        const opportunityId = target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
        if (opportunityId) this.learnMore(opportunityId)
      }
    })
  }

  private openPartnershipModal(): void {
    const modal = document.getElementById('partnership-modal')
    if (modal) {
      modal.style.display = 'flex'
    }
  }

  private closePartnershipModal(): void {
    const modal = document.getElementById('partnership-modal')
    if (modal) {
      modal.style.display = 'none'
    }
  }

  private submitPartnershipRequest(): void {
    // Mock form submission
    this.showNotification('Partnership request submitted successfully!', 'success')
    this.closePartnershipModal()
    
    // Reset form
    const form = document.getElementById('partnership-form') as HTMLFormElement
    form?.reset()
  }

  private viewPartnerDetails(partnerId: string): void {
    const partner = this.currentPartners.find(p => p.id === partnerId)
    if (partner) {
      alert(`Viewing details for ${partner.name}. This would open a detailed partner profile.`)
    }
  }

  private applyForOpportunity(opportunityId: string): void {
    const opportunity = this.collaborationOpportunities.find(o => o.id === opportunityId)
    if (opportunity) {
      alert(`Applying for "${opportunity.title}". This would open an application form.`)
    }
  }

  private learnMore(opportunityId: string): void {
    const opportunity = this.collaborationOpportunities.find(o => o.id === opportunityId)
    if (opportunity) {
      alert(`Learning more about "${opportunity.title}". This would show detailed opportunity information.`)
    }
  }

  private getOpportunityTypeClass(type: string): string {
    switch (type) {
      case 'research':
        return 'bg-blue-100 text-blue-800'
      case 'technology':
        return 'bg-purple-100 text-purple-800'
      case 'distribution':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
}