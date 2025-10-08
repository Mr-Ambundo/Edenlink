import './styles/main.css'
import { Router } from './router'
import { AppStore } from './stores/AppStore'
import { SocketService } from './services/SocketService'
import { Sidebar } from './components/shared/Sidebar'

class App {
  private router: Router
  private store: AppStore
  private socketService: SocketService
  private sidebar: Sidebar | null = null

  constructor() {
    this.store = new AppStore()
    this.socketService = new SocketService()
    this.router = new Router()

    // Expose router globally for navigation
    ;(window as any).router = this.router

    this.init()
  }

  private async init() {
    // Initialize socket connection for real-time features
    await this.socketService.connect()
    
    // Initialize router
    this.router.init()
    
    // Initialize sidebar for non-landing pages
    this.initializeSidebar()
    
    // Set up global error handling
    this.setupErrorHandling()
    
    // Initialize app state
    this.store.init()
    
    console.log('🌱 Eden Link initialized successfully!')
  }

  private initializeSidebar(): void {
    // Listen for route changes to show/hide sidebar
    window.addEventListener('popstate', () => {
      this.updateSidebarVisibility()
    })

    // Listen for custom navigate events
    window.addEventListener('navigate', () => {
      setTimeout(() => this.updateSidebarVisibility(), 50)
    })

    // Initial sidebar setup after a short delay
    setTimeout(() => {
      this.updateSidebarVisibility()
    }, 100)
  }

  private updateSidebarVisibility(): void {
    const currentPath = window.location.pathname
    const isLandingPage = currentPath === '/'
    
    if (!isLandingPage && !this.sidebar) {
      // Create and mount sidebar
      this.sidebar = new Sidebar()
      const sidebarElement = this.sidebar.render()
      document.body.appendChild(sidebarElement)
      this.sidebar.mounted()
      
      // Adjust main content margin
      this.adjustMainContentMargin(true)
    } else if (isLandingPage && this.sidebar) {
      // Remove sidebar
      const sidebarContainer = document.querySelector('.sidebar-container')
      if (sidebarContainer) {
        sidebarContainer.remove()
      }
      this.sidebar = null
      
      // Reset main content margin
      this.adjustMainContentMargin(false)
    } else if (this.sidebar) {
      // Update active route
      this.sidebar.setActiveRoute(currentPath)
    }
  }

  private adjustMainContentMargin(hasSidebar: boolean): void {
    const appContainer = document.getElementById('app')
    if (appContainer) {
      if (hasSidebar) {
        appContainer.style.marginLeft = '280px'
        appContainer.style.transition = 'margin-left 0.3s ease'
      } else {
        appContainer.style.marginLeft = '0'
      }
    }
    
    // Listen for sidebar collapse events
    if (hasSidebar) {
      window.addEventListener('sidebarToggle', (e: any) => {
        if (appContainer) {
          appContainer.style.marginLeft = e.detail.collapsed ? '80px' : '280px'
        }
      })
    }
  }
  private setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
    })

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    })
  }
}

// Initialize the application
new App()